const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JogosSchema = new Schema({
    dt: Date,
    time1: String,
    time2: String,
    time1Gols: Number,
    time2Gols: Number,
    time1Gols12: Number,
    time2Gols12: Number
});

module.exports = mongoose.model('Jogos', JogosSchema);
