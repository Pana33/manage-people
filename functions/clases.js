export class ConstantStrings {
    TABLE_USERS = "Users"
    TABLE_EMPLOYEE = "Employee"
}

export class NewUser {
    changePw = true
    dtCreated = new Date()
    emailUser = ""
    firstName = ""
    fullName = ""
    isActive = true
    isAdmin = ""
    lastName = ""
    constructor(objectWithInfo){
        this.emailUser = objectWithInfo.emailUser
        this.firstName = objectWithInfo.firstName
        this.fullName = objectWithInfo.firstName + " " + objectWithInfo.lastName
        this.isAdmin = objectWithInfo.isAdmin
        this.lastName = objectWithInfo.lastName
    }
}