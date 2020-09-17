const mongoose = require('mongoose');
const Rounds = require('./rounds');

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  seasons: [{}]
})

usersSchema.statics.updatePlayerInfo = async (username, season) => {

  const userInfo = await Users.getPlayerInfo(username)

  if(userInfo){
    console.log("USER FOUND")
  } else{
    console.log("USER NOT FOUND")
  }

  return userInfo

  // const seasons = {
  //   season: season,
  //   handicap: (await Rounds.findHandicap(season)),
  //   lowest: (await Rounds.findLowest(season)),
  //   average: (await Rounds.findAverage(season)),
  //   highest: (await Rounds.findHighest(season)),
  //   rounds: (await Rounds.findRoundCount(season)),
  //   courses: (await Rounds.findCourseCount())
  // }

}

usersSchema.statics.getPlayerInfo = async (username) => {
  const userInfo = (await Users.findOne( { username: username } ))

  if(userInfo){
    return userInfo
  }

  return
}

usersSchema.statics.getSeasonInfo = async (username, querySeason) => {

  const userInfo = await Users.getPlayerInfo(username)

  if(userInfo){
    seasonInfo = userInfo.seasons.filter(season => season.season == querySeason)[0]

    return seasonInfo
  }

  return

}

usersSchema.statics.initializePlayerDefaults = async (username, season) => {

  const user = await Users.getPlayerInfo(username)

  if(!user){
    const userInfo = {
      username: username,
      seasons: [{
        season: season,
        handicap: "-",
        lowest: "-",
        average: "-",
        highest: "-",
        rounds: 0,
        courses: 0
      }]
    }

    const newUser = await new Users(userInfo)
    newUser.save()

    return newUser
  }

  return {
      error: "Existing User"
    }


}

const Users = mongoose.model("users", usersSchema)

module.exports = Users
