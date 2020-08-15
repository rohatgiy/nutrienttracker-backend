const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var entrySchema = new Schema({
    food_codes: {type:Array, required: true}, // array of all of today's food codes
    food_names: {type: Array, required: true},
    nutrients: [
        {
            nutrient: {type: String, required: true},
            amount: {type: Number, required: true}
        }
    ],
    date: {type: Date, default: Date.now}
});

module.exports=mongoose.model("Entry", entrySchema);