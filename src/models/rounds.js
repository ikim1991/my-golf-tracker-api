const mongoose = require("mongoose")
const Courses = require('./courses');
const math = require('mathjs');

const roundsSchema = mongoose.Schema({
  playedOn: {
    type: Date,
    required: true
  },
  season: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  holes: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  scores: {

  },
  par: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  scoreDifferential: {
    type: Number,
    required: true
  },
  handicapDifferential: {
    type: Number
  }
})

roundsSchema.methods.calculateHandicapDifferential = async function() {
  const round = this
  const course = await Courses.findCourseByName(this.course)

  const diff = (this.totalScore - course.rating) * 113 / course.slope

  round.handicapDifferential = diff
  round.save()

  return diff
}

roundsSchema.statics.findBySeason = async (season) => {
  const rounds = await Rounds.find({ season: season })

  return rounds
}

roundsSchema.statics.findAverage = async (season) => {
  const rounds = await Rounds.find({ season: season }).select("scoreDifferential -_id")

  return (rounds.map(diff => diff.scoreDifferential).reduce((total, num) => total + num) / rounds.length)
}

roundsSchema.statics.findLowest = async (season) => {
  const lowest = (await Rounds.find({ season: season }).sort({ scoreDifferential: "asc" }).select("scoreDifferential -_id").limit(1))[0].scoreDifferential

  return lowest
}

roundsSchema.statics.findHighest = async (season) => {
  const highest = (await Rounds.find({ season: season }).sort({ scoreDifferential: "desc" }).select("scoreDifferential -_id").limit(1))[0].scoreDifferential

  return highest
}

roundsSchema.statics.findHandicap = async (season) => {
  const count = await Rounds.find({ season: season }).countDocuments()
  if(count <= 10){
    let rounds = await Rounds.find( { season: season }).sort( { scoreDifferential: "asc" }).select("scoreDifferential -_id").limit(3)
    return (rounds.map(diff => diff.scoreDifferential).reduce((total, num) => total + num) / rounds.length) * 0.96
  } else if(count > 10 && count < 20){
    let rounds = await Rounds.find( { season: season }).sort( { scoreDifferential: "asc" }).select("scoreDifferential -_id").limit(5)
    return (rounds.map(diff => diff.scoreDifferential).reduce((total, num) => total + num) / rounds.length) * 0.96
  } else{
    let rounds = await Rounds.find( { season: season }).sort( { scoreDifferential: "asc" }).select("scoreDifferential -_id").limit(10)
    return (rounds.map(diff => diff.scoreDifferential).reduce((total, num) => total + num) / rounds.length) * 0.96
  }
}

roundsSchema.statics.findRoundCount = async (season) => {
  return await Rounds.find({ season: season }).countDocuments()
}

roundsSchema.statics.findCourseCount = async () => {
  return await Courses.find().countDocuments()
}

roundsSchema.statics.createScorecard = async (season) => {
  const rounds = await Rounds.findBySeason(season)
  const courses = await Courses.find()

  if(rounds.length > 0){
    return rounds.map(round => {

      let coursePar = courses.filter(course => round.course === course.courseName)[0].par
      let scores = math.subtract(round.scores[round.holes[0]].concat(round.scores[round.holes[1]]), coursePar[round.holes[0]].concat(coursePar[round.holes[1]]))

      return[round.playedOn, round.course].concat(scores).concat([round.par, round.totalScore, round.scoreDifferential])
    })
  } else{
    return [[ (new Date()).toLocaleDateString(), "COURSE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]]
  }


}

roundsSchema.statics.createLinePlotCoordinates = async (season) => {
  const rounds = await Rounds.findBySeason(season)

  const xAxis = rounds.map(round => round.playedOn)
  const yAxis = rounds.map(round => round.scoreDifferential)

  return{
    xAxis, yAxis
  }
}

roundsSchema.statics.calculateCounts = async (season) => {
  const rounds = await Rounds.findBySeason(season)
  const courses = await Courses.find()
  const scoreCounts = {
    "eagle": 0,
    "birdie": 0,
    "par": 0,
    "bogey": 0,
    "double": 0,
    "triple": 0,
    "quad": 0
  }

  const countArray = rounds.map(round => {
    let coursePar = courses.filter(course => round.course === course.courseName)[0].par
    let par = coursePar[round.holes[0]].concat(coursePar[round.holes[1]])
    let scores = round.scores[round.holes[0]].concat(round.scores[round.holes[1]])

    return math.subtract(scores, par)
  }).forEach(count => {
    count.forEach(c => {
      if(c <= -2){
        scoreCounts['eagle'] += 1
      } else if(c === -1){
        scoreCounts['birdie'] += 1
      } else if(c === 0){
        scoreCounts['par'] += 1
      } else if(c === 1){
        scoreCounts['bogey'] += 1
      } else if(c === 2){
        scoreCounts['double'] += 1
      } else if(c === 3){
        scoreCounts['triple'] += 1
      } else{
        scoreCounts['quad'] += 1
      }
    })
  })

  return scoreCounts
}

const Rounds = mongoose.model("rounds", roundsSchema)

module.exports = Rounds
