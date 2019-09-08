'use strict'

var express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/',(req,res,next)=>{
    res.sendFile('index.html');
});

app.listen(9000,err=>{
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Listening to port 9000");
        
    }
})