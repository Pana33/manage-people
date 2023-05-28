const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth")
const db = getFirestore();
const auth = getAuth();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "http://localhost:4200", methods:["POST","PUT"] }));

class ConstantStrings {
    TABLE_USERS = "Users"
    TABLE_EMPLOYEE = "Employees"
}

const strings = new ConstantStrings()

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

class NewEmployee {
    changePw = true
    dtCreated = new Date()
    isActive = true
    constructor(objectWithInfo){
        this.curp = objectWithInfo.curp
        this.emailEmployee = objectWithInfo.emailEmployee
        this.firstName = objectWithInfo.firstName
        this.fullName = objectWithInfo.firstName + " " + objectWithInfo.lastName
        this.lastName = objectWithInfo.lastName
    }
}

//Funciones principales, realizan la insercion, creacion y edicion de la data
function createDocument(table,idDocument,document){
    return new Promise ((res,rej)=>{
        createUser(idDocument).then(resCreate=>{
            db.collection(table).doc(idDocument).set(document).then(resDocument=>{
                console.log("Document created")
                res("ok")
            }).catch(errDocument=>{
                console.log("The document can't be created ",errDocument)
                rej("Error creating document")
            })
        }).catch(errCreate=>{
            console.log("User can't be created ",errCreate)
            rej("Error creating new user")
        })
    })
}

function updateDocument(table,idDocument,currentStatus){
    return new Promise((res,rej)=>{
        getUidUser(idDocument).then(resUid=>{
            changeActiveUser(resUid.uid,currentStatus).then(resActive=>{
                db.collection(table).doc(idDocument).update({ isActive:!currentStatus }).then(resUpdate=>{
                    res("ok")
                }).catch(errActive=>{
                    rej("error isActive on database ",errActive)
                })
            }).catch(errActive=>{
                rej("error isActive on auth user ",errActive)
            })
        }).catch(errActive=>{
            rej("getting the uid ",errActive)
        })
    })
}

function deleteDocument(table,idDocument){
    return new Promise((res,rej)=>{
        getUidUser(idDocument).then(resUid=>{
            deleteUser(resUid.uid).then(resActive=>{
                db.collection(table).doc(idDocument).delete().then(resDelete=>{
                    res("ok")
                }).catch(errActive=>{
                    rej("error isActive on database")
                })
            }).catch(errActive=>{
                rej("error isActive on auth user")
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
        auth.createUser({
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
        auth.getUserByEmail(email).then((userRecord) => {
            console.log(`Successfully fetched user data: ${userRecord.uid}`);
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
        auth.updateUser(uid, {disabled: status}).then((userRecord) => {
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
        auth.deleteUser(uid).then((userRecord) => {
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
    let dataToFirebase = {...documentNewUser}
    console.log(dataToFirebase)
    createDocument(strings.TABLE_USERS,documentNewUser.emailUser,dataToFirebase).then(resCreate=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errCreate=>{
        res.send(JSON.stringify({"estatus":errCreate}))
    })
})

app.put('/disableEnableUser',(req,res)=>{
    console.log(req.body);
    updateDocument(strings.TABLE_USERS,req.body.emailUser,req.body.isActive,).then(resUpdate=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errUpdate=>{
        res.send(JSON.stringify({"estatus":errUpdate}))
    })
})

app.put('/deleteUser',(req,res)=>{
    console.log(req.body);
    deleteDocument(strings.TABLE_USERS,req.body.emailUser).then(resDelete=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errDelete=>{
        res.send(JSON.stringify({"estatus":errDelete}))
    })
})

app.post('/addEmployee',(req,res)=>{
    console.log(req.body);
    let documentNewEmployee = new NewEmployee(req.body)
    let dataToFirebase = {...documentNewEmployee}
    console.log(dataToFirebase)
    createDocument(strings.TABLE_EMPLOYEE,documentNewEmployee.emailEmployee,dataToFirebase).then(resCreate=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errCreate=>{
        res.send(JSON.stringify({"estatus":errCreate}))
    })
})

app.put('/disableEnableEmployee',(req,res)=>{
    console.log(req.body);
    updateDocument(strings.TABLE_EMPLOYEE,req.body.emailEmployee,req.body.isActive,).then(resUpdate=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errUpdate=>{
        res.send(JSON.stringify({"estatus":errUpdate}))
    })
})

app.put('/deleteEmployee',(req,res)=>{
    console.log(req.body);
    deleteDocument(strings.TABLE_EMPLOYEE,req.body.emailEmployee).then(resDelete=>{
        res.send(JSON.stringify({"estatus":"ok"}))
    }).catch(errDelete=>{
        res.send(JSON.stringify({"estatus":errDelete}))
    })
})

exports.managePeople = functions.https.onRequest(app);
