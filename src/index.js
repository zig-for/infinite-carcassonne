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
	board.tryInsertTile(gamelogic.TileTypes.CCCC, 0, 0, 0)
	board.tryInsertTile(gamelogic.TileTypes.CCCC, 1, 0, 0)
	board.tryInsertTile(gamelogic.TileTypes.CCCC, 1, 1, 0)
	board.tryInsertTile(gamelogic.TileTypes.SingleCity, -1, 0, 1)

	var brk = document.createElement("br");
	element.appendChild(brk.cloneNode());

	

    for(var y = board.extents[0][1]; y <= board.extents[1][1]; y++) {
    	var div = document.createElement("div");
    	div.style.height = "90px"; // hack
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