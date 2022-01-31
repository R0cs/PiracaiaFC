const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TorneioSchema = new Schema({
    nome: String,
    image: String,
    inicio: String,
    fim: String,
    descricao: String,
    clubes: [{
        type: Schema.Types.ObjectId,
        ref: 'Clubes'
    }],
    jogos: [{
        type: Schema.Types.ObjectId,
        ref: 'Jogos'
    }]

});

module.exports = mongoose.model('Torneio', TorneioSchema);

