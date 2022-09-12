const { getMongoConnection } = require('./connect');
const axios = require('axios');
const e = require('express');
const lodash = require('lodash');
var url = "mongodb://localhost:27017/";
//console.log("client",client)
(async () => {
const mongoconn = await getMongoConnection(url);
const { connStatus, client } = mongoconn;
const db = client.db("mydb");
let i
try{
    if(connStatus){
      let latlon=await db.collection("UK-latest1").find({}).project({"latitude":1,"longitude":1}).toArray()
      dataChunks = lodash.chunk(latlon, 30)
      dataInChunks=lodash.flatten(dataChunks)
      //console.log(dataInChunks)
       
       for(let eachchunk of dataInChunks){
       // console.log(eachchunk)
          let url1=`https://api.postcodes.io/postcodes?lon=${eachchunk.longitude}&lat=${eachchunk.latitude}`
           
            let status
            let postcode=[]
           await axios.get(url1)
           .then(async function(response) {

            //console.log(response.data)
            if(response.data.result===null && response.data.status===200){
             // console.log("inside")
              status=404
           
        
          }
          else if(response.data.result!==null){
                 status=200
                 result1=response.data.result.length
                 for(let j=0;j<result1;j++){
                      postcode.push(response.data.result[j].postcode)
                     
                 }
                //console.log("postcode",postcode)
               
                 
          }
           else if(response.data.status==404){
           status=404
         
         }
        //  console.log("eachchunk.latitude",eachchunk.latitude)
        //  console.log("longitude",eachchunk.longitude)
         await db.collection("UK-latest1").updateOne({latitude:eachchunk.latitude,longitude:eachchunk.longitude},
         {$set:{"status":status,"postcode":postcode}})
         console.log("success")
         console.log("status",status)
         
       
            
              
           }).catch(async function(err){
              console.log("error")
           })
        
          
           
        }
    }
}
catch(e){
  console.log(e)
}
})()