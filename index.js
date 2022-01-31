const { json } = require('express');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { torneiosSchema, clubesSchema, jogosSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Torneio = require('./models/torneios');
const Clube = require('./models/clubes');
const Jogo = require('./models/jogos');
const torneios = require('./models/torneios');
const { STATUS_CODES } = require('http');
const { parse } = require('querystring');

mongoose.connect('mongodb://localhost:27017/piracaiafc', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connection open!!')
    })
    .catch(err => {
        console.log("Oh no!! Mongo connection error!!!")
        console.log(err)
    });

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

const validateTorneios = (req, res, next) => {
    const { error } = torneiosSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateClubes = (req, res, next) => {
    const { error } = clubesSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateJogos = (req, res, next) => {
    const { error } = jogosSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

// const torneios = [
//     {
//         id: 1,
//         nome: 'Torneio de masters 1',
//         formato: 'Pontos corridos',
//         dtInicio: '12/06/1985',
//         dtFinal: '12/06/1985',
//         times: ['LYON', 'BORUSSIA', 'ATLETICO DE MADRID', 'LIVERPOOL', 'MILAN']
//     },
//     {
//         id: 2,
//         nome: 'Torneio de masters 2',
//         formato: 'Pontos Corridos',
//         dtInicio: '12/06/1985',
//         dtFinal: '12/06/1985',
//         times: ['LYON', 'BORUSSIA', 'ATLETICO DE MADRID', 'LIVERPOOL', 'MILAN']
//     },

// ];

// const times = [
//     {
//         nome: 'Lyon',
//         torneio: 2,
//         pontos: 9,
//         jogos: 0,
//         vitorias: 0,
//         empates: 0,
//         derrotas: 0,
//         gols: 4,
//         gols12: 0
//     },
//     {
//         nome: 'Borussia',
//         torneio: 2,
//         pontos: 7,
//         jogos: 0,
//         vitorias: 0,
//         empates: 0,
//         derrotas: 0,
//         gols: 10,
//         gols12: 1
//     },
//     {
//         nome: 'Atletico de Madrid',
//         torneio: 2,
//         pontos: 2,
//         jogos: 0,
//         vitorias: 0,
//         empates: 0,
//         derrotas: 0,
//         gols: 0,
//         gols12: 0
//     },
//     {
//         nome: 'Liverpool',
//         torneio: 2,
//         pontos: 9,
//         jogos: 0,
//         vitorias: 0,
//         empates: 0,
//         derrotas: 0,
//         gols: 5,
//         gols12: 0
//     },
//     {
//         nome: 'Milan',
//         torneio: 2,
//         pontos: 7,
//         jogos: 0,
//         vitorias: 0,
//         empates: 0,
//         derrotas: 0,
//         gols: 10,
//         gols12: 2
//     },
// ];



app.get('/sobre', (req, res) => {
    res.render('sobre');
})

app.get('/torneios', catchAsync(async (req, res) => {
    const torneios = await Torneio.find({});
    res.render('torneios', { torneios });
}));

app.get('/torneios/novo', (req, res) => {
    res.render('novo');
});

app.post('/torneios', validateTorneios, catchAsync(async (req, res) => {
    const torneio = new Torneio(req.body.torneios)
    await torneio.save();
    res.redirect(`/torneios/${torneio._id}`)

}));

app.get('/torneios/novoClube/:id', catchAsync(async (req, res,) => {
    const torneio = req.params;
    res.render('novoClube', { torneio });
}));

app.post('/torneios/novoClube/:id', validateClubes, catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id);
    const clube = new Clube(req.body.clubes);
    torneio.clubes.push(clube);
    await torneio.save();
    await clube.save();
    res.redirect(`/torneios/${torneio._id}`);
}));

app.get('/torneios/jogos/:id', catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id).populate('clubes').populate('jogos');

    torneio.clubes.sort(function (a, b) {
        if (a.dt < b.dt) {
            return 1;
        }
        if (a.dt > b.dt) {
            return -1;
        } else {
            return 0;
        }
    });

    res.render('jogos', { torneio });
}));

app.get('/torneios/novoJogo/:id', catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id).populate('clubes');
    res.render('novoJogo', { torneio });
}));

app.post('/torneios/novoJogo/:id', validateJogos, catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id);
    const jogos = req.body.jogos;
    var clube1 = await Clube.findById(jogos.time1);
    var clube2 = await Clube.findById(jogos.time2);

    function sum(number1, number2) {
        var DECIMAL = 10;
        return parseInt(number1, DECIMAL) + parseInt(number2, DECIMAL);
    }

    const nGolsTime1 = sum(jogos.time1Gols, jogos.time1Gols12);
    const nGolsTime2 = sum(jogos.time2Gols, jogos.time2Gols12);

    console.log('-------------------');
    console.log('nGolsTime1- ' + nGolsTime1 + ' nGolsTime2- ' + nGolsTime2);
    console.log('-------------------');

    if (nGolsTime1 > nGolsTime2) {
        clube1.vitorias++;
        clube1.pontos = clube1.pontos + 3;
        clube2.derrotas++;
        console.log('vitoria time 1');
    } else {
        if (nGolsTime1 < nGolsTime2) {
            clube2.vitorias++;
            clube2.pontos = clube2.pontos + 3;
            clube1.derrotas++;
            console.log('vitoria time 2');
        } else {
            clube1.empates++;
            clube2.empates++;
            clube1.pontos = clube1.pontos + 1;
            clube2.pontos = clube2.pontos + 1;
            console.log('empate');
        }
    }
    clube1.jogos++;
    clube2.jogos++;
    clube1.gols = sum(clube1.gols, nGolsTime1);
    clube2.gols = sum(clube2.gols, nGolsTime2);
    clube1.gols12 = sum(clube1.gols12, jogos.time1Gols12);
    clube2.gols12 = sum(clube2.gols12, jogos.time2Gols12);

    console.log('-------------------');
    console.log('-------------------');
    console.log('-------------------');
    console.log('atualizado resultado')
    console.log('-------------------');

    console.log('clube1 - ' + clube1)
    console.log('-------------------');
    console.log('clube2 - ' + clube2)
    console.log('-------------------');


    const jogo = new Jogo(req.body.jogos)
    torneio.jogos.push(jogo);
    await torneio.save();
    await jogo.save();
    await Clube.findByIdAndUpdate(clube1._id, { ...clube1 });
    await Clube.findByIdAndUpdate(clube2._id, { ...clube2 });

    res.redirect(`/torneios/${torneio._id}`);
}));

app.get('/torneios/:id', catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id).populate('clubes');

    console.log(torneio);

    torneio.clubes.sort(function (a, b) {
        if (a.pontos < b.pontos) {
            return 1;
        }
        if (a.pontos > b.pontos) {
            return -1;
        }
        if (a.pontos = b.pontos) {
            if (a.gols < b.gols) {
                return 1;
            }
            if (a.gols > b.gols) {
                return -1;
            }
            if (a.gols = b.gols) {
                if (a.gols12 < b.gols12) {
                    return 1;
                }
                if (a.gols12 > b.gols12) {
                    return -1;
                }
                if (a.gols12 = b.gols12) {
                    return 0;
                }
            }
        }
    });
    console.log('after sort ===================');
    console.log(torneio);
    res.render('torneio', { torneio });

}));

app.get('/torneios/:id/edit', catchAsync(async (req, res) => {
    const torneio = await Torneio.findById(req.params.id);
    res.render('edit', { torneio });
}));



app.put('/torneios/:id', validateTorneios, catchAsync(async (req, res) => {
    const { id } = req.params;
    const torneio = await Torneio.findByIdAndUpdate(id, { ...req.body.torneios });
    res.redirect(`/torneios/${torneio._id}`)
}));

app.delete('/torneios/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Torneio.findByIdAndDelete(id);
    res.redirect('/torneios');
}));


app.all('*', (req, res, next) => {
    next(new ExpressError('Pagina não encontrada', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Ah não, algo deu errado!!!'
    res.status(statusCode).render('error', { err })
})


// app.get('/torneios/:id/tabela', (req, res) => {
//     const { id } = req.params;
//     const torneio = torneios.find(c => c.id === parseInt(id));
//     times.sort(function (a, b) {
//         if (a.pontos < b.pontos) {
//             return 1;
//         }
//         if (a.pontos > b.pontos) {
//             return -1;
//         }
//         if (a.pontos = b.pontos) {
//             if (a.gols < b.gols) {
//                 return 1;
//             }
//             if (a.gols > b.gols) {
//                 return -1;
//             }
//             if (a.gols = b.gols) {
//                 if (a.gols12 < b.gols12) {
//                     return 1;
//                 }
//                 if (a.gols12 > b.gols12) {
//                     return -1;
//                 }
//                 if (a.gols12 = b.gols12) {
//                     return 0;
//                 }
//             }
//         }
//     });
//     console.log(times);
//     res.render('tabela', { torneio, times });

// })

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})