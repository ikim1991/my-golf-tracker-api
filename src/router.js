const express = require('express')
const router = new express.Router()
const Courses = require('./models/courses');
const Rounds = require('./models/rounds');


const rounds = {
    playedOn: "2020-08-11",
    course: "Eaglepoint Golf Resort",
    holes: ["Front 9", "Back 9"],
    scores:{
      "Front 9": [4, 5, 3, 4, 5, 5, 6, 5, 4],
      "Back 9": [3, 5, 3, 4, 5, 5, 5, 5, 4]
    },
    par: 72,
    totalScore: 81,
    scoreDifferential: 9,
    handicapDifferential: 20
  }

const courses = {

  courseName: "Eaglepoint Golf Resort",
  totalHoles: 18,
  holes: ["Front 9", "Back 9"],
  par: {
    "Front 9": [4, 4, 5, 3, 5, 4, 3, 4, 4],
    "Back 9": [4, 4, 3, 4, 5, 3, 4, 4, 5]
  },
  rating: 70.2,
  slope: 123,
}

const round = new Rounds(rounds)
const course = new Courses(courses)

router.get("/", async (req, res) => {

  const userInfo = {
    rounds: rounds,
    courses: courses
  }

  res.status(201).send(userInfo)
})

module.exports = router
