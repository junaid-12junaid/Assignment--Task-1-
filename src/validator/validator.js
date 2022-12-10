const mongoose = require("mongoose")
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const validString = function (value) {
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidName = /^[A-Z][a-z,.'-]+(?: [A-Z][a-z,.'-]+)*$/

const marksRegex=/^(\d)*?([0-9]{1})?$/

function isValidEmail(data){
    const emailCheck = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
    if(emailCheck.test(data)) return true
}

const isValidPassword = function (pw) {
  let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
  if (pass.test(pw)) return true;
};

const idCharacterValid = function (value) {
    return mongoose.Types.ObjectId.isValid(value);
  };

const keyValid = function (value) {
  if (Object.keys(value).length > 0) return true;
  return false;
};



module.exports = { isValid, isValidName,marksRegex,idCharacterValid, isValidEmail, isValidPassword, keyValid, validString }