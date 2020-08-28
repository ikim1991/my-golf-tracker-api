const express = require('express')
const router = new express.Router()
const Courses = require('./models/courses');
const Rounds = require('./models/rounds');
const Users = require('./models/users');

router.get("/", async (req, res) => {

  const user = await Users.getPlayerInfo("Chris K.")
  const courses = await Courses.getCourses()

  if(user){
    return res.status(201).send({user, courses})
  }

  res.status(404).send({error: "User Not Found"})

  // res.status(201).send(latestSeason)
})

router.post("/newcourse", async (req, res) => {
  if(req.body.holes.length === new Set(req.body.holes).size){
    const course = new Courses(req.body)
    await course.save()

    console.log(await Courses.find())
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

  console.log(round)

  res.send({status: "SUCCESS"})
})

module.exports = router
