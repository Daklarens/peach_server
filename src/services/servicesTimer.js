const { db, ObjectId } = require("../db");


class TimerService {
  constructor() {}

  async createNewTimer(description, userId) {
    const query = {
      start: Date.now(),
      description: description,
      isActive: true,
      userId: ObjectId(userId),
      end:0,
    };
    const dbConnect = await db();
    const dbCreateTimer = await dbConnect.collection("timers")
      .insertOne(query)
    return dbCreateTimer.insertedId;
  }

  async getActiveTimers(userId) {
    const dbConnect = await db();
    const listActiveTimers = await dbConnect.collection("timers")
      .find({userId:ObjectId(userId), isActive: true}).toArray()    
    let listTimers = [];
    if (listActiveTimers.length !== 0 || listActiveTimers !== undefined) {
      listActiveTimers.forEach((item, i) => {
        listTimers.push({
          id: listActiveTimers[i]._id,
          start: Number(listActiveTimers[i].start),
          description: listActiveTimers[i].description,
          progress: Date.now() - Number(listActiveTimers[i].start),
        });
      });
      return listTimers;
    } else {
      return true;
    }
  }
  async getOldTimers(userId) {
    const dbConnect = await db();
    const listOldTimers = await dbConnect.collection("timers")
      .find({userId:ObjectId(userId), isActive:false}).toArray()  
    let listActiveTimers = [];
    if (listOldTimers.length !== 0 || listOldTimers !== undefined) {
      listOldTimers.forEach((item, i) => {
        listActiveTimers.push({
          id: listOldTimers[i]._id,
          start: Number(listOldTimers[i].start),
          end: Number(listOldTimers[i].end),
          duration: Number(listOldTimers[i].end) - Number(listOldTimers[i].start),
          description: listOldTimers[i].description,
          progress: Date.now() - Number(listOldTimers[i].start),
        });
      });
      if(listActiveTimers.length == 0){
        return {}
      }else{
        return listActiveTimers;
      }
    }
  }

  async stopTimer(idTimer, userId) {
    const query = {
      end: Date.now(),
      isActive: false,
    }
    const dbConnect = await db();
    const stopTimer = await dbConnect.collection("timers")
      .findOneAndUpdate({_id:ObjectId(idTimer), userId:ObjectId(userId)},
      {$set:query},
      {returnOriginal:false})  
    return stopTimer;  
  }
  async countTimer(userId) {
    const dbConnect = await db();
    const dbCountTimer = await dbConnect.collection("timers")
      .find({userId:ObjectId(userId)}).toArray()
    return dbCountTimer.length;  
  } 

}

module.exports = {
    TimerService,
}