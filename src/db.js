const {MongoClient} = require('mongodb')
require('dotenv').config()

const options = {
    useNewUrlParser: true,
    maxPoolSize: 50, 
}


const MongoDBclient = new MongoClient(process.env.MONGODB,options)

// Функция для получения клиента из пула
async function getClientFromPool() {
    const client = new MongoClient(mongoURL, options);
    await client.connect();
    return client;
  }
  
const connect = async () =>{
    try {
        await MongoDBclient.connect()
        console.log("Успешно подключились к базе данных")
        await MongoDBclient.close()
        console.log("Закрыли подключение")
        return true
    } catch (e) {
        console.log(e)
        return false
    }
 }

 const insert = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log(`Подключение для добавления данных [${coll}]`)
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.insertOne(data)
 
        await MongoDBclient.close()
        console.log(`Данные внесены! Отключение от базы [${coll}]`)
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const insertAll = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        console.log(`Подключение для внесения нескольких данных [${coll}]`)
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        const data = await employees.insertMany(data)
 
        await MongoDBclient.close()
        console.log(`Данные внесены! Отключение от базы [${coll}]`)
        return data
    } catch (e) {
        console.log(e)
    }
 }
 
 const count = async (coll,data) =>{
    try {
        await MongoDBclient.connect()
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        console.log(`Количество документов в базе данных [${coll}] :`, AllDocuments.length)
        await MongoDBclient.close()
        return AllDocuments.length
    } catch (e) {
        console.log(e)
    }
 }

 const find = async (coll,data) =>{

    try {
        await MongoDBclient.connect()
        console.log(`Подключение для поиска по базе [${coll}]`)
 
        const AllDocuments = await MongoDBclient.db(process.env.NAMEDB).collection(coll).find(data).toArray()
        //console.log(AllDocuments)
 
        await MongoDBclient.close()
        return AllDocuments
    } catch (e) {
        console.log(e)
    }
 }

 const update = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        console.log(`Подключение для обновления данных [${coll}]`)
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.updateOne(data, {$set:newdata})
 
        await MongoDBclient.close()
        console.log(`Закрыли подключение [${coll}]`)
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const deleteOne = async (coll,data,newdata) =>{
    try {
        await MongoDBclient.connect()
        console.log(`Подключение для обновления данных [${coll}]` )
 
        const employees = MongoDBclient.db(process.env.NAMEDB).collection(coll)
        await employees.deleteOne(data, {newdata})
 
        await MongoDBclient.close()
        console.log(`Закрыли подключение [${coll}]`)
        return true
    } catch (e) {
        console.log(e)
    }
 }

 const endDB = async ()=>{
    await MongoDBclient.close()
 }

module.exports = {connect, insert, insertAll, count, find, update, deleteOne,endDB}