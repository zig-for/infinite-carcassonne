import _ from 'lodash';


var gamelogic = require('./shared/gamelogic.js')
//import foo from './shared/gamelogic.js'

/*var gamelogic = require('./shared/gamelogic.js')

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n' + gamelogic.foo);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/


function component() {
	const element = document.createElement('div');

	element.innerHTML = _.join(['Hello', 'world', gamelogic], ' ');

	
	var board = new gamelogic.GameBoard();
	board.tryInsertTile(gamelogic.TileTypes.CityEWRoad, 0, 0, 0)
	
	var brk = document.createElement("br");
	element.appendChild(brk.cloneNode());

	const usePhysicalBag = true;

	var tileBag = []

	function refillBag() {
		var allPossibleTiles = Object.keys(gamelogic.TileTypes);
		for(const tile of allPossibleTiles) {
			tileBag = tileBag.concat(Array(gamelogic.BaseTileDistribution[tile]).fill(tile));
		}
	}
	
	refillBag();
	var numTiles = tileBag.length * 4;

	for(var placedTiles = 0; placedTiles < numTiles; placedTiles++) {
		if(tileBag.length == 0)
		{
			refillBag();
		}

		var index = Math.floor( Math.random()*tileBag.length );
		var tile = gamelogic.TileTypes[tileBag[index]];

		for(const strPos of board.freeTiles) {
			const pos = JSON.parse(strPos)
			const rotation = Math.floor( Math.random()*4 );
			var inserted = false;
			for(var i = 0; i < 4; i++) {
				if(board.tryInsertTile(tile, pos[0], pos[1], (rotation + i ) % 4)) {
					inserted = true;
					break
				}
			}
			if(inserted) {
				break;
			}
		}
		if(usePhysicalBag)
		{
  			tileBag.splice( index, 1 );
		}

	}
/*
	const maxsize = 20
    for(var y = 0; y < maxsize; y++) {
    	for(var x = 0; x < maxsize; x++) {

    		if(x == 0 && y == 0) {
    			continue;
    		}

    		var possibleTiles = allTiles.slice(0);
			
    		while(possibleTiles.length) {
  			    var index = Math.floor( Math.random()*possibleTiles.length );
  			    console.log(possibleTiles[index]);
    			var tile = gamelogic.TileTypes[possibleTiles[index]];

    			const rotation = Math.floor( Math.random()*4 );
    			var inserted = false;
  				for(var i = 0; i < 4; i++) {
	    			if(board.tryInsertTile(tile, x, y, (rotation + i ) % 4)) {
						inserted = true;
	    				break
	    			}
	    		}
	    		if(inserted) {
	    			break;
	    		}

    			possibleTiles.splice( index, 1 );
    		}
    		

    	}
    }
    */

    for(var y = board.extents[0][1]; y <= board.extents[1][1]; y++) {
    	var div = document.createElement("div");
    	div.style.height = "90px"; // hack
    	div.style.width = 2*90*(1+board.extents[1][1] - board.extents[0][1]) + "px";
    	element.appendChild(div)
    	for(var x = board.extents[0][0]; x <= board.extents[1][0]; x++) {
    		var t = board.get(x, y);
    		var img = document.createElement("img");
    		
    		if(t) {
    			img.style.transform = "rotate(" + 90 * t.r + "deg)";
    			img.src = "tileimages/" + t.t.name + ".png";
    		}
    		else
    		{
    			img.src = "tileimages/empty.png";
    		}
    		div.appendChild(img);
    	}
    	//element.appendChild(brk.cloneNode());
    }


    return element;
}

document.body.appendChild(component());