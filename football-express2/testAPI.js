// run nodemon testAPI.js from command line

// TODO: Figure out how to hide connection string

// Create a spike to initialize the database with the teams separate from the main program
// Put the model and schema in its own file so you can import it in the spike and main program

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 9000
const mongoose = require('mongoose')
const teamModel = require('./team.js')
const playbook = require('./playbook.js')
require('dotenv').config();

app.use(cors())

// later make defaults that it goes to 
let gameInfo = {
    down: 1,
    yardsToGo: 10,
    ballLocation: 25,
    firstDownMarker: 35,
    gotTouchdown: false,
    gotFirstDown: false,
    t1Score: 0,
    t2Score: 0

}


let connectionString = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.esr4y.mongodb.net/testdb?retryWrites=true&w=majority`;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb database')
});



// TODO: try to chane this to promises instead of async await
async function run(teamName1, teamName2) {
    let team1 = await teamModel.findOne({name: teamName1});
    let team2 = await teamModel.findOne({name: teamName2});
    gameInfo.t1Name = team1.name;
    gameInfo.t1Rating = team1.rating;
    gameInfo.t2Name = team2.name;
    gameInfo.t2Rating = team2.rating;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
    let data = req.body;
    await run(data.params.team1, data.params.team2);

    gameInfo.possession = gameInfo.t1Name;
    gameInfo.ballLocation = 25;
    gameInfo.firstDownMarker = 35;
    gameInfo.yardsToGo = 10;
    gameInfo.down = 1;
    gameInfo.touchdown = false;
    gameInfo.gotFirstDown = false;
    gameInfo.t1Score = 0;
    gameInfo.t2Score = 0;
    
    res.json(gameInfo)
})

app.post('/playcall', async (req, res, next) => {
    
    gameInfo.yardsGained = await playbook(req.body.params.play);
    gameInfo.ballLocation += gameInfo.yardsGained;
    
    // First Down
    if (gameInfo.ballLocation >= gameInfo.firstDownMarker) {
        gameInfo.down = 1;
        gameInfo.firstDownMarker = gameInfo.ballLocation + 10;
        gameInfo.gotFirstDown = true;
    }
    
    // Turnover on Downs
    else if (gameInfo.down == 4) {
        gameInfo.ballLocation = 25;
        gameInfo.firstDownMarker = 35;
        gameInfo.yardsToGo = 10;
        gameInfo.down = 1;
        gameInfo.touchdown = false;
        gameInfo.gotFirstDown = false;
        if (gameInfo.possession == gameInfo.t1Name) {
            gameInfo.possession = gameInfo.t2Name;
        }
        else {
            gameInfo.possession = gameInfo.t1Name; 
        }
    }
    else {
        gameInfo.down += 1
    }

    gameInfo.yardsToGo = gameInfo.firstDownMarker - gameInfo.ballLocation;

    if (gameInfo.ballLocation >= 100) {
        gameInfo.ballLocation = 25;
        gameInfo.firstDownMarker = 35;
        gameInfo.yardsToGo = 10;
        gameInfo.down = 1;
        gameInfo.touchdown = true;
        if (gameInfo.possession == gameInfo.t1Name) {
            gameInfo.t1Score += 7;
            gameInfo.possession = gameInfo.t2Name;
        }
        else {
            gameInfo.t2Score += 7;
            gameInfo.possession = gameInfo.t1Name; 
        }
    }

    res.json(gameInfo);
    gameInfo.touchdown = false;
    gameInfo.gotFirstDown = false;
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))