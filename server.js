const { timeStamp } = require('console');
const express=require('express');
const { stat } = require('fs');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'));
});
app.get('/api/health',(req,res)=>{
    res.json({
        status:'ok',
        timeStamp: new Date().toISOString(),
        message:'Smart Wardrobe simulator is running'
    });
});
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Use this to test the rfid functions and send heartbeats , without the device');
});
process.on('SIGINT',()=>{
    console.log('Shutting down...');
    process.exit();
});
module.exports=app;
