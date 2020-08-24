const mongoose = require("mongoose")
const Courses = require('./courses');

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


const Rounds = mongoose.model("rounds", roundsSchema)

module.exports = Rounds
