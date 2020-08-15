const mongoose = require("mongoose")

const coursesSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    trim: true
  },
  totalHoles: {
    type: Number,
    required: true
  },
  holes: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  par: {
    
  },
  rating: {
    type: Number,
    required: true,
  },
  slope: {
    type: Number,
    requried: true
  }
})

const Courses = mongoose.model("Courses", coursesSchema)

module.exports = Courses
