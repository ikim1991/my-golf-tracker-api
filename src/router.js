const express = require('express')
const router = new express.Router()
const Courses = require('./models/courses');
const Rounds = require('./models/rounds');
const Users = require('./models/users');

router.get("/", async (req, res) => {

  let user = await Users.getPlayerInfo("Chris K.")

  if(!user){
    user = await Users.initializePlayerDefaults("Chris K.", (new Date().getFullYear()))
  }

  const courses = await Courses.getCourses()
  const year = user.seasons[user.seasons.length - 1].season

  const linePlot = await Rounds.createLinePlotCoordinates(year)
  const scoreCount = await Rounds.calculateCounts(year)
  const scorecard = await Rounds.createScorecard(year)

  if(user){
    return res.status(201).send({user, courses, year, linePlot, scoreCount, scorecard})
  }

  res.status(404).send({error: "User Not Found"})

})

router.post("/season", async (req, res) => {

  const year = req.body.year
  const username = req.body.user.username
  const courses = await Courses.getCourses()
  const user = await Users.getPlayerInfo(username)
  const linePlot = await Rounds.createLinePlotCoordinates(year)
  const scoreCount = await Rounds.calculateCounts(year)
  const scorecard = await Rounds.createScorecard(year)

  if(user){
    return res.status(201).send({user, courses, year, linePlot, scoreCount, scorecard})
  }

  res.status(404).send({error: "User Not Found"})

})

router.post("/newcourse", async (req, res) => {
  if(req.body.holes.length === new Set(req.body.holes).size){
    const course = new Courses(req.body)
    await course.save()

    res.send({status: "SUCCESS"})
  } else{
    res.send({status: "ERROR"})
  }
})

router.post("/newround", async (req, res) => {

  const par = await Courses.calculatePar(req.body.course, req.body.holes)
  const scoreDifferential = parseInt(req.body.totalScore) - par

  const round = new Rounds({
    playedOn: req.body.playedOn,
    season: req.body.season,
    course: req.body.course,
    holes: req.body.holes,
    scores: req.body.scores,
    par: par,
    totalScore: req.body.totalScore,
    scoreDifferential: scoreDifferential
  })

  await round.save()
  await round.calculateHandicapDifferential()
  await Users.updatePlayerInfo("Chris K.", req.body.season)

  res.send({status: "SUCCESS"})
})

module.exports = router
