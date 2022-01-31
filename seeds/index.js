const mongoose = require('mongoose');
const Torneio = require('../models/torneios');


mongoose.connect('mongodb://localhost:27017/piracaiafc', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connection open!!')
    })
    .catch(err => {
        console.log("Oh no!! Mongo connection error!!!")
        console.log(err)
    });

// const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Torneio.deleteMany({});
    for (let i = 1; i < 11; i++) {
        const camp = new Torneio({
            nome: `master ${i}`, descricao: `novo torneio teste ${i}`, image: 'https://source.unsplash.com/collection/9920102', inicio: '2022-01-01', fim: '2022-01-30'

        })
        await camp.save();
    }
}
console.log('done!!!')

seedDB().then(() => {
    mongoose.connection.close();
})