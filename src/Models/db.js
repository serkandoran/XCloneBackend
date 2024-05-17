
const { MongoClient } = require('mongodb')


const uri = 'mongodb+srv://serkan:serkan123@cluster0.ewau8v3.mongodb.net/'
const dbName = 'twitterclone'

let cachedDb = null

async function connectToDatabase(){
   if(cachedDb){
      return cachedDb
   }

   const client = await MongoClient.connect(uri)
   const db = client.db(dbName)

   cachedDb = db
   return db
}

module.exports = connectToDatabase














