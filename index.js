const { json } = require('express');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('home')
})


const torneios = [
    {
        id: 1,
        nome: 'Torneio de masters 1',
        formato: 'Pontos corridos',
        dtInicio: '12/06/1985',
        dtFinal: '12/06/1985',
        times: ['LYON', 'BORUSSIA', 'ATLETICO DE MADRID', 'LIVERPOOL', 'MILAN']
    },
    {
        id: 2,
        nome: 'Torneio de masters 2',
        formato: 'Pontos Corridos',
        dtInicio: '12/06/1985',
        dtFinal: '12/06/1985',
        times: ['LYON', 'BORUSSIA', 'ATLETICO DE MADRID', 'LIVERPOOL', 'MILAN']
    },

];

const times = [
    {
        nome: 'Lyon',
        torneio: 2,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols: 0,
        gols12: 0
    },
    {
        nome: 'Borussia',
        torneio: 2,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols: 0,
        gols12: 0
    },
    {
        nome: 'Atletico de Madrid',
        torneio: 2,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols: 0,
        gols12: 0
    },
    {
        nome: 'Liverpool',
        torneio: 2,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols: 0,
        gols12: 0
    },
    {
        nome: 'Milan',
        torneio: 2,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols: 0,
        gols12: 0
    },
];

app.get('/torneios', (req, res) => {
    res.render('torneios', { torneios });
})

app.get('/torneios/:id/tabela', (req, res) => {
    const { id } = req.params;
    const torneio = torneios.find(c => c.id === parseInt(id));
    res.render('tabela', { torneio, times });
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})