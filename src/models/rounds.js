const mongoose = require("mongoose")

const roundsSchema = mongoose.Schema({
  playedOn: {
    type: Date,
    required: true
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
    type: Number,
    required: true
  }
})

const Rounds = mongoose.model("rounds", roundsSchema)

module.exports = Rounds
