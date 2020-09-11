const mongoose = require('mongoose')


let connectionString = 'mongodb+srv://bchase:Ramsmongodb01@cluster0.esr4y.mongodb.net/testdb?retryWrites=true&w=majority';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb database')
});

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
})

let teamModel = mongoose.model('teamModel', teamSchema);

let rams = new teamModel({
    name: 'Rams',
    rating: 90
})

rams.save(function (err, rams) {
        if (err) return console.error(err);
    }
);