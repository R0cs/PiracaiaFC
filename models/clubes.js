const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubesSchema = new Schema({
    nome: String,
    pontos: Number,
    jogos: Number,
    vitorias: Number,
    empates: Number,
    derrotas: Number,
    gols: Number,
    gols12: Number,
    escudo: String,
    jogadores: String

});

module.exports = mongoose.model('Clubes', ClubesSchema);

