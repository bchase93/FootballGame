// Run npm start from cmd line

import React, {useState, useEffect, useCallback} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const axios = require('axios');


function Game() {
  const [newGame, startNewGame] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [ranking1, setRanking1] = useState(0);
  const [ranking2, setRanking2] = useState(0);
  const [ballLocation, setBallLocation] = useState(25);
  const [down, setDown] = useState(1);
  const [firstDownMarker, setFirstDownMarker] = useState(35);
  const [yardsGained, setYardsGained] = useState('');
  const [yardsToGo, setYardsToGo] = useState(10);
  const [gotTouchdown, setGotTouchdown] = useState('');
  const [gotFirstDown, setGotFirstDown] = useState('');
  const [playWasCalled, setPlayWasCalled] = useState('');
  const [possession, setPossession] = useState('');
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [awayTeamScore, setAwayTeamScore] = useState(0);

  function drawField() {
    var c = document.getElementById("myCanvas");  // TODO change so that there are endzones make width 1200 not 1000
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    for (let i=100; i<1001; i+=100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 533);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(ballLocation * 10, 0);
    ctx.lineTo(ballLocation * 10, 533);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(firstDownMarker * 10, 0);
    ctx.lineTo(firstDownMarker * 10, 533);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
  }
  

  useEffect(() => {
    if (playWasCalled) {
      axios.post('http://localhost:9000/playcall', {
        params: {
          play: playWasCalled
        }
      })
      .then(res => {
        setYardsGained(res.data.yardsGained);
        setBallLocation(res.data.ballLocation);
        setDown(res.data.down);
        setFirstDownMarker(res.data.firstDownMarker);
        setYardsToGo(res.data.yardsToGo);
        setPossession(res.data.possession);
        
        if (res.data.touchdown) {
          setGotTouchdown('Touchdown!');
          setHomeTeamScore(res.data.t1Score);
          setAwayTeamScore(res.data.t2Score);

        }
        else {
          setGotTouchdown('');
        }
        
        if (res.data.gotFirstDown) {
          setGotFirstDown('First Down!');
        }
        else {
          setGotFirstDown('');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  
      setPlayWasCalled('');
    }
  },[playWasCalled])

  useEffect(() => {
    if(newGame == true) {
      axios.post('http://localhost:9000', {
        params: {
          numPlayers: "Single Player",
          team1: homeTeam,
          team2: awayTeam
        }
      })
      .then(res => {
        setRanking1(res.data.t1Rating);
        setRanking2(res.data.t2Rating);
        setPossession(res.data.possession);
        
      })
      .catch(function (error) {
        console.log(error);
      })
    }
    
  },[newGame])

  useEffect(() =>{
    if (newGame) {
      drawField();
    }
  })
  

  return (
    <div>
      <p>Home Team: {homeTeam}</p>
      <button onClick={() => setHomeTeam("Rams")}>
        Rams
      </button>
      <button onClick={() => setHomeTeam("Seahawks")}>
        Seahawks
      </button>
      <button onClick={() => setHomeTeam("Cardinals")}>
        Cardinals
      </button>
      
      <p>Away Team: {awayTeam}</p>
      <button onClick={() => setAwayTeam("Rams")}>
        Rams
      </button>
      <button onClick={() => setAwayTeam("Seahawks")}>
        Seahawks
      </button>
      <button onClick={() => setAwayTeam("Cardinals")}>
        Cardinals
      </button>
      <hr/>

      <div>
      <button onClick={() => startNewGame(true)}>
        Start Game
      </button>
      </div>
      
      {/* <p>{ranking1} vs {ranking2}</p> */}
      <hr/>
      <div id="gameStats">
        <p>Score: {homeTeam} {homeTeamScore}    {awayTeam} {awayTeamScore} </p>
        <p>{possession} ball on {ballLocation}  First Down on {firstDownMarker}</p>
        <p>Down: {down}  Yards to go: {yardsToGo}</p>
        <p>Yards gained: {yardsGained}</p>
        <button onClick={() => setPlayWasCalled("run")}>Run</button>
        <button onClick={() => setPlayWasCalled("pass")}>Pass</button>
        <p>Event: {gotTouchdown} {gotFirstDown}</p>
        <div>
          <canvas id="myCanvas" width="1000" height="533"></canvas>
        </div>
      </div>
    </div>
  );
}



ReactDOM.render(<Game />, document.getElementById('root'));


