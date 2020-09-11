const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
    name: String,
    rating: Number
})
let teamModel = mongoose.model('teamModel', teamSchema);

module.exports = teamModel;