const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const { createDocument, updateDocument, deleteDocument } = require('./conexion-db');
const { ConstantStrings, NewUser } = require("./clases");
const strings = new ConstantStrings()

const app = express();

app.use(cors({ origin: "http://localhost:4200", methods:["POST","PUT"] }));

app.post('/addUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
    let documentNewUser = new NewUser(userData)
    console.log(documentNewUser)
    // createDocument(strings.TABLE_USERS,userData.emailUser,documentNewUser).then(resCreate=>{
    //     res.send(JSON.stringify({"estatus":"ok"}))
    // }).catch(errCreate=>{
    //     res.send(JSON.stringify({"estatus":errCreate}))
    // })
    res.send(JSON.stringify({"estatus":"ok"}))
})

app.put('/updateUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
    res.send("ok")
})

app.put('/deleteUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
    res.send("ok")
})

app.post('/addEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
    res.send("ok")
})

app.put('/updateEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
    res.send("ok")
})

app.put('/deleteEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
    res.send("ok")
})

exports.managePeople = functions.https.onRequest(app);
