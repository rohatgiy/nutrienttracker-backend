const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var entrySchema = require('./entry').schema;

var userSchema = new Schema({
    username: {type: String, required: true, unique: true, minlength: 5, trim: true},
    password: {type: String, required: true, minlength: 8},
    firstname: {type: String, required: true},
    entries:[entrySchema],
});

module.exports=mongoose.model('User', userSchema, 'users');