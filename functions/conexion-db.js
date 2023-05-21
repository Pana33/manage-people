const admin = require('firebase-admin');
admin.initializeApp();

const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

export function createDocument(table,idDocument,document){
    return new Promise ((res,rej)=>{
        createUser(idDocument).then(resCreate=>{
            db.collection(table).doc(idDocument).set(document).then(resDocument=>{
                console.log("Document created")
                res("Ok")
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

export function updateDocument(table,idDocument,document,typeUpdate){
    return new Promise((res,rej)=>{
        if(typeUpdate == "info"){
            db.collection(table).doc(idDocument).update(document).then(resInfo=>{
                res("Ok")
            }).catch(errActive=>{
                rej("error updating on database")
            })
        }else{
            getUidUser(idDocument).then(resUid=>{
                db.collection(table).doc(idDocument).update(document).then(resUpdate=>{
                    changeActiveUser(resUid.getUid(),document).then(resActive=>{
                        res("Ok")
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

export function deleteDocument(table,idDocument){
    return new Promise((res,rej)=>{
        getUidUser(idDocument).then(resUid=>{
            db.collection(table).doc(idDocument).delete().then(resDelete=>{
                deleteUser(resUid.getUid()).then(resActive=>{
                    res("Ok")
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

function createUser(email){
    return new Promise((res,rej)=>{
        getAuth().createUser({
            email: email,
            password: 'Default',
            emailVerified: false,
            disabled: false,
        }).then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
            res("Ok")
        }).catch((error) => {
            console.log('Error creating new user:', error);
            rej("Error creating new user")
        });
    })
}

function getUidUser(email){
    return new Promise ((res,rej)=>{
        getAuth().getUserByEmail(email).then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
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