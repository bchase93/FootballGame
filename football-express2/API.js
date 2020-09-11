// run nodemon testAPI.js from command line

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 9000

app.use(cors())

let gameInfo = {
    down: 1,
    yardsToGo: 10
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
    let data = req.body
    console.log(data)
    res.json(gameInfo)
})

app.post('/playcall', (req, res, next) => {
    console.log("yay playcall")
    gameInfo.down += 1
    res.json(gameInfo)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))