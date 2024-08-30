const { db,ObjectId } = require("../db");

class UserService {
  constructor() {}
  async addUser(name, password) {
    const query = {
      username: name,
      password: password,
    };
    const dbConnect = await db();
    const dbCreateUser = await dbConnect.collection("users")
      .insertOne(query)
    return dbCreateUser.insertedId;
  }
  async findUser(nameOrId) {
    const dbConnect = await db();
    const dbfindUser = await dbConnect.collection("users")
      .findOne({username:nameOrId});
    if(!dbfindUser){
      const dbfinId = await dbConnect.collection("users")
        .findOne({_id:ObjectId(nameOrId)});
      if(!dbfinId){
        return undefined;
      }
      return dbfinId;  
    }else{
      return dbfindUser;
    } 
      
  }

  async findSessionUser(sessionId) {
    const dbConnect = await db();
    const dbfindSession = await dbConnect.collection("sessions")
      .findOne({_id:ObjectId(sessionId)});
    return dbfindSession;  
  }

  async createSession(userId) {
    const query = {
      "userId":ObjectId(userId)
    }
    const dbConnect = await db();
    const dbCreateSession = await dbConnect.collection("sessions")
      .insertOne(query)
    return dbCreateSession.insertedId;
  }
  async deleteSession(sessionId) {
    const dbConnect = await db();
    const dbDeleteSession = await dbConnect.collection("sessions")
      .deleteOne({_id:ObjectId(sessionId)})
    console.log(sessionId);  
  }
  async countTimer(userId) {
    const dbConnect = await db();
    const dbCountTimer = await dbConnect.collection("timers")
      .find({userId:ObjectId(userId)}).toArray()
    return dbCountTimer.length;  
  } 
}

module.exports = {
    UserService,
}