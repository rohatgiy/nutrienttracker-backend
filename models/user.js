const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var entrySchema = require('./entry').schema;

var userSchema = new Schema({
    username: {type: String, required: true, unique: true, minlength: 5, trim: true},
    password: {type: String, required: true, minlength: 8},
    firstname: {type: String, required: true},
    entries:[entrySchema],
    gender: {type: String, enum: ["male", "female"], required: true},
    age: {type: Number, required: true, min: 11}
});

module.exports=mongoose.model('User', userSchema, 'users');