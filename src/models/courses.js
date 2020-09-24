const mongoose = require("mongoose")

const coursesSchema = new mongoose.Schema({
  courseName: {
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

coursesSchema.statics.findCourseByName = async (name) => {
  const course = await Courses.findOne({ courseName: name })

  return course
}

coursesSchema.statics.getCourses = async () => {
  const courses = await Courses.find()

  return courses
}

coursesSchema.statics.calculatePar = async (name, holes) => {
  const course = await Courses.findOne({ courseName: name })

  const par = (course.par[holes[0]].concat(course.par[holes[1]])).reduce((total, num) => parseInt(total) + parseInt(num))

  return par
}

const Courses = mongoose.model("courses", coursesSchema)

module.exports = Courses
