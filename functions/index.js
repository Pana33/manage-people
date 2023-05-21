const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
import { createDocument, updateDocument, deleteDocument } from './conexion-db'

const app = express();

app.use(cors({ origin: "http://localhost:4200/", methods:["POST","PUT","DELET"] }));

app.post('/addUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
})

app.put('/updateUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
})

app.delete('/deleteUser',(req,res)=>{
    console.log(req.body);
    let userData = req.body;
})

app.post('/addEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
})

app.put('/updateEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
})

app.delete('/deleteEmployee',(req,res)=>{
    console.log(req.body);
    let employeeData = req.body;
})

exports.managePeople = functions.https.onRequest(app);
