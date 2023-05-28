const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth")
const db = getFirestore();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "http://localhost:4200", methods:["POST","PUT"] }));

class ConstantStrings {
    TABLE_USERS = "Users"
    TABLE_EMPLOYEE = "Employee"
}

class NewUser {
    changePw = true
    dtCreated = new Date()
    isActive = true
    constructor(objectWithInfo){
        this.emailUser = objectWithInfo.emailUser
        this.firstName = objectWithInfo.firstName
        this.fullName = objectWithInfo.firstName + " " + objectWithInfo.lastName
        this.isAdmin = objectWithInfo.isAdmin
        this.lastName = objectWithInfo.lastName
    }
}

const strings = new ConstantStrings()

//Funciones principales, realizan la insercion, creacion y edicion de la data
function createDocument(table,idDocument,document){
    return new Promise ((res,rej)=>{
        createUser(idDocument).then(resCreate=>{
            db.collection(table).doc(idDocument).set(document).then(resDocument=>{
                console.log("Document created")
                res("ok")
            }).catch(errDocument=>{
                console.log("The document can't be created")
                rej("Error creating document")
            })
        }).catch(errCreate=>{
            console.log("User can't be created")
            rej("Error creating new user")
        })
    })
}

function updateDocument(table,idDocument,document,typeUpdate){
    return new Promise((res,rej)=>{
        if(typeUpdate == "info"){
            db.collection(table).doc(idDocument).update(document).then(resInfo=>{
                res("ok")
            }).catch(errActive=>{
                rej("error updating on database")
            })
        }else{
            getUidUser(idDocument).then(resUid=>{
                db.collection(table).doc(idDocument).update(document).then(resUpdate=>{
                    changeActiveUser(resUid.getUid(),document).then(resActive=>{
                        res("ok")
                    }).catch(errActive=>{
                        rej("error isActive on auth user")
                    })
                }).catch(errActive=>{
                    rej("error isActive on database")
                })
            }).catch(errActive=>{
                rej("getting the uid")
            })
        }
    })
}

function deleteDocument(table,idDocument){
    return new Promise((res,rej)=>{
        getUidUser(idDocument).then(resUid=>{
            db.collection(table).doc(idDocument).delete().then(resDelete=>{
                deleteUser(resUid.getUid()).then(resActive=>{
                    res("ok")
                }).catch(errActive=>{
                    rej("error isActive on auth user")
                })
            }).catch(errActive=>{
                rej("error isActive on database")
            })
        }).catch(errActive=>{
            rej("getting the uid")
        })
    })
}
//Funciones secundarias, se encargan de proporcionar los datos necesarios a las principales
//como el moldeado de la data o conseguir el uid del usuario por ejemplo
function createUser(email){
    return new Promise((res,rej)=>{
        getAuth().createUser({
            email: email,
            password: 'default',
            emailVerified: false,
            disabled: false,
        }).then((userRecord) => {
            console.log('Successfully created new user:', userRecord.uid);
            res("ok")
        }).catch((error) => {
            console.log('Error creating new user:', error);
            rej("Error creating new user")
        });
    })
}

function getUidUser(email){
    return new Promise ((res,rej)=>{
        getAuth().getUserByEmail(email).then((userRecord) => {
            console.log(`Successfully fetched user data: ${userRecord.getUid()}`);
            res(userRecord)
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
            rej(error)
        });
    })
}

function changeActiveUser(uid,status){
    return new Promise ((res,rej)=>{
        getAuth().updateUser(uid, {disabled: status}).then((userRecord) => {
            console.log('Successfully updated user', userRecord.toJSON());
            res(userRecord)
        })
        .catch((error) => {
            console.log('Error updating user:', error);
            rej(error)
        });
    })
}

function deleteUser(uid){
    return new Promise ((res,rej)=>{
        getAuth().deleteUser(uid).then(() => {
            console.log('User deleted');
            res(userRecord);
        }).catch((error) => {
            console.log('Error deleting user:', error);
            rej(error);
        });
    })
}

//TRABAJO CON EXPRESS PARA EL MANEJO DE LA RUTA SELECCIONADA
app.post('/addUser',(req,res)=>{
    console.log(req.body);
    let documentNewUser = new NewUser(req.body)
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
