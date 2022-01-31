const Joi = require('joi');

module.exports.torneiosSchema = Joi.object({
    torneios: Joi.object({
        nome: Joi.string().required(),
        inicio: Joi.date().required(),
        fim: Joi.date().required(),
        descricao: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.clubesSchema = Joi.object({
    clubes: Joi.object({
        nome: Joi.string().required(),
        escudo: Joi.string().required(),
        jogadores: Joi.string().required(),
        jogos: Joi.number().min(0),
        pontos: Joi.number().min(0),
        vitorias: Joi.number().min(0),
        empates: Joi.number().min(0),
        derrotas: Joi.number().min(0),
        gols: Joi.number().min(0),
        gols12: Joi.number().min(0)
    }).required()
});

module.exports.jogosSchema = Joi.object({
    jogos: Joi.object({
        dt: Joi.string().required(),
        time1: Joi.string().required(),
        time2: Joi.string().required(),
        time1Gols: Joi.number().required().min(0),
        time2Gols: Joi.number().required().min(0),
        time1Gols12: Joi.number().required().min(0),
        time2Gols12: Joi.number().required().min(0)
    }).required()
}); 