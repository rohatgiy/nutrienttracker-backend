const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.conf_password = !isEmpty(data.conf_password) ? data.conf_password : "";

  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "Must have a first name";
  } else if (!Validator.isAlpha(data.firstname)) {
    errors.firstname = "First name can only contain letters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Must have a username";
  } else if (!Validator.isAlphanumeric(data.username)) {
    errors.username = "Username can only contain letters and numbers";
  } else if (!Validator.isLength(data.username, {min: 4, max: 15})){
    errors.username = "Username must be between 4 and 15 characters"
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Must have a password";
  }
if (Validator.isEmpty(data.conf_password)) {
    errors.conf_password = "Confirm password field is required";
  }
if (!Validator.isLength(data.password, { min: 8 })) {
    errors.password = "Password must be at least 8 characters";
  }
if (!Validator.equals(data.password, data.conf_password)) {
    errors.conf_password = "Passwords must match";
  }
  
return {
    errors,
    isValid: isEmpty(errors)
  };
};