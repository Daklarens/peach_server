const db = require("../db");
const { verifyDecode, createToken } = require('../verify');

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
    const data = await db.update('users',{tid},{...update})
    return data
  }
  async createAnkets(anket){
    const {token,...data} = anket
    const verify = verifyDecode(token)
    const dataUser = await db.find('users',{tid:verify.decoded.id})
    if(dataUser.length >0){
      data.tid = verify.decoded.id
      await db.insert('ankets',data)
      console.log('Анкета с данными :',data)
      console.log('создана')
      //ответом об успехе будет новый токен в котором будут данные о анкете 
      const newToken = await createToken(data)
      return {token:newToken}
    }else{

    }
    
  }
  async checkAnkets(tid){
    const count = await db.find('ankets',{tid})
    if(count.length > 0){
      return count[0]
    }else{
      return false
    }
  }
  async makerloader(user){
    const getData = await this.getInfoUser(user.id)
    const countUser = await db.count('users')
    if(getData){
      if(getData === user){
        console.log('Данные пользователя сходятся tid: ', user.id)
        return true
      }else{
        //Вносим новые данные в базу
        const {userId, ...update} = user
        console.log('Обновление данных tid: ',user.id)
        await  this.updateInfoUser(userId,update)
        return true
      }
    }else{
      //Регистрация данных пользователя
      console.log('Регистрация пользователя tid: ', user.id)
      user.tid = user.id
      user.id = countUser+1
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
  async getAnketsForUser(tid,page){
    const anketUser = await db.find('ankets',{tid})
    if(anketUser.length === 1){
      //ищем все действия пользователя
      const arrActions = await db.find('actions',{uid:tid})
      console.log(arrActions)
      //формируем из запроса массив 
      const tidArray = arrActions.map(profile => profile.tid);
      //удаляем повторения
      const uniqueTids = [...new Set(tidArray)];
      //ищем анкеты которые не соответствуют массиву 
      console.log(uniqueTids)
      const ankets = await db.find('ankets',{sex:anketUser[0].searchsex,dbId:{ $nin: uniqueTids }})
      console.log(ankets)
      if (page === 0) {
        return ankets.slice(0, 6);  // Отправляем нужную порцию анкет
      } else {
        return ankets.slice(0, 3);// Отправляем нужную порцию анкет
      }
    }else{
      return false
    }
  }
  async actionsAnkets(tid, arr){
    if(arr === false){
      return arr
    }else{
      const likedItems = arr
      .filter(item => item.action === true)  // Отфильтровываем элементы с лайками
      .map(item => item.tid);
      //поиск анкет которые лайкнули этого пользователя
      const check = await db.find('actions',{uid:{$in:likedItems},tid})
      const updatedArr = arr.map(action => ({
        uid: tid,
        dbId: action.tid,
        action: action.action
      }));
      await db.insertAll('actions',updatedArr)
      //Подключить бота для оповещения для других пользователей
      return check.length || false
    }
  }
  async matchAnkets(tid){
    const likedAnkets = await db.find('actions', { uid: tid, action: true });
    const arrUsers = likedAnkets.map(item => item.tid);
    if (arrUsers.length === 0) {
      return false;
    }
    const reversedArrUsers = arrUsers.reverse();
    const matchUsers = await db.find('ankets', { dbId: { $in: reversedArrUsers }, action:true });
    const sortedMatchUsers = matchUsers.sort((a, b) => {
      return reversedArrUsers.indexOf(a.tid) - reversedArrUsers.indexOf(b.tid);
    });
    return sortedMatchUsers.length > 0 ? sortedMatchUsers : false;
  }

}
module.exports = {
    UserService,
}