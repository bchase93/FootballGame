const mongoose = require('mongoose')
const teamModel = require('./team.js')

let connectionString = 'mongodb+srv://bchase:Ramsmongodb01@cluster0.esr4y.mongodb.net/testdb?retryWrites=true&w=majority';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb database')
});


let rams = new teamModel({
    name: 'Rams',
    rating: 90
})

let seahawks = new teamModel({
    name: 'Seahawks',
    rating: 50
})

let cardinals = new teamModel({
    name: 'Cardinals',
    rating: 20
})


// TODO: try to chane this to promises instead of async await
async function executeQueries() {
    await teamModel.deleteMany({name: 'Rams'});
    await rams.save();
    let randomteam = await teamModel.find({});
    console.log(randomteam);
    mongoose.connection.close();

}

executeQueries()