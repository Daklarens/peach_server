const db = require("../db");

class UserService {
  constructor() {}
 
  async createUser(user){
    const data = await db.insert('users',{...user})
    if(data){
      return true
    }else{
      return false
    }
  }
  async getInfoUser(tid){
    const data = await db.find('users',{tid})
    if(data.length > 0){
        return data[0]
    }else{
        return false
    }
  }
  async updateInfoUser(tid,update){
    const data = await db.updateOne('users',{tid},{...update})
    return data
  }
  async createAnkets(anket){

  }
  async checkAnkets(tid){
    const count = await db.count('ankets',{tid})
    if(count.length > 0){
      return true
    }else{
      return false
    }
  }
  async makerloader(user){
    const getData = await this.getInfoUser(user.id)
    if(getData){
      if(getData === user){
        console.log('Данные пользователя сходятся tid: ', user.id)
        return true
      }else{
        //Вносим новые данные в базу
        console.log('Обновление данных tid: ',user.id)
        await  this.updateInfoUser(user.id,user)
        return true
      }
    }else{
      //Регистрация данных пользователя
      console.log('Регистрация пользователя tid: ', user.id)
      await this.createUser(user)
      return true
    }
  }

  //Проверка зарегистрирован пользователь или нет и проверка наличия анкеты
  async userLoader (user){
    //Проверка есть ли пользователь в базе данных
    const login = await this.makerloader(user)
    //Проверкеа есть ли у пользователя анкета
    const anket = await this.checkAnkets(user.id)
    if(login && anket){
      return {user:anket}
    }else{
      return {user:false}
    }
  }

}
module.exports = {
    UserService,
}