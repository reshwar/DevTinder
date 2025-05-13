const validator = require('validator')
const validateSignUp = (req) => {
    const { firstname, lastname, emailId,password, age, gender } = req.body
    if(!firstname || !lastname){
        throw new Error('Names are mandatory')
    } else if (!validator.isEmail(emailId)){
        throw new Error('invalid email')
    } else if (!validator.isStrongPassword(password)){
        throw new Error('Passoword is weak')
    } else if(age < 0 || age > 150){
        throw new Error('age is invalid')
    }
}

const validateEditProfile = (req)=>{
    const allowedProfileEdit = ['firstname','lastname','age','gender','skill','about','profileUrl']
    isEditAllowed = Object.keys(req.body).every((key)=>allowedProfileEdit.includes(key))
    return isEditAllowed
}

module.exports = { validateSignUp,validateEditProfile }