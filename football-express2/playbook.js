// Handle playcalls sent to server

function getYards(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}
  

function simulatePlay(playcall) {

    switch(playcall) {
        case 'run':
            yards = getYards(1, 2);
            return yards;
    
        case 'pass':
            yards = getYards(6, 10);
            return yards;
        case 'field goal':
            return;
    
    }
}


module.exports = simulatePlay;