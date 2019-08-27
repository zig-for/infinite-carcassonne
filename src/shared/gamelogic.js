const assert = require('assert');

/*
South is +Y
East is +X
Rotation is Clockwise
*/

const Dir = {
	N: 0,
	E: 1,
	S: 2,
	W: 3
}

const DirToVec = {
	[Dir.N]: [0, -1],
	[Dir.E]: [+1, 0],
	[Dir.S]: [0, +1],
	[Dir.W]: [-1, 0],
}

function oppositeDir(d)
{
	return (d+2) % 4
}


// Defines the connections between corners
// All directions are required to be defined
// Field tiles don't use this system - they can be defined as connected or disconnected 
// whichever is more convenient
var ConnectionTypes = {
	All: [[Dir.N, Dir.E, Dir.W, Dir.S]], // EG: city on all sides
	None: [[Dir.N], [Dir.E], [Dir.W], [Dir.S]], // EG: Field on all sides
	ThreeWayCity: [[Dir.N, Dir.E, Dir.W], [Dir.S]], 
	EW: [[Dir.E, Dir.W], [Dir.S], [Dir.N]],
	CornerCity: [[Dir.N, Dir.W], [Dir.S, Dir.E]],
}
// TODO: validate connectiontypes

var EdgeType = {
	Field: 0, // None?
	Road: 1,
	City: 2,
	//River: 3, // someday?
}

var Feature = {
	Cloister: 0,
	CityBonus: 1,
	// Garden: 2,
}


// Base tile types
// https://russcon.org/RussCon/carcassonne/tiles.html
var TileTypes = {
	CCCC: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.City], connections: ConnectionTypes.All, Features:{[Feature.CityBonus]: true}},
	RRRR: {edges: [EdgeType.Road, EdgeType.Road, EdgeType.Road, EdgeType.Road], connections: ConnectionTypes.None},
	CCC: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.Field], connections: ConnectionTypes.ThreeWayCity},
	CCCB: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.Field], connections: ConnectionTypes.ThreeWayCity, Features:{[Feature.CityBonus]: true}},
	CCCR: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.Road], connections: ConnectionTypes.ThreeWayCity},
	CCCRB: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.Road], connections: ConnectionTypes.ThreeWayCity, Features:{[Feature.CityBonus]: true}},
	RRR: {edges: [EdgeType.Road, EdgeType.Road, EdgeType.Road, EdgeType.Field], connections: ConnectionTypes.None},
	LongCity: {edges: [EdgeType.Field, EdgeType.City, EdgeType.Field, EdgeType.City], connections: ConnectionTypes.EW},
	LongCityB: {edges: [EdgeType.Field, EdgeType.City, EdgeType.Field, EdgeType.City], connections: ConnectionTypes.EW, Features:{[Feature.CityBonus]: true}},
	StraightRoad: {edges: [EdgeType.Road, EdgeType.Field, EdgeType.Road, EdgeType.Field], connections: [[Dir.N, Dir.S], [Dir.E], [Dir.W]]},
	CCGG: {edges: [EdgeType.City, EdgeType.Field, EdgeType.Field, EdgeType.City], connections: ConnectionTypes.CornerCity},
	CCGGB: {edges: [EdgeType.City, EdgeType.Field, EdgeType.Field, EdgeType.City], connections: ConnectionTypes.CornerCity,Features: {[Feature.CityBonus]: true}},
	CCRR: {edges: [EdgeType.City, EdgeType.Road, EdgeType.Road, EdgeType.City], connections: ConnectionTypes.CornerCity},
	CCRRB: {edges: [EdgeType.City, EdgeType.Road, EdgeType.Road, EdgeType.City], connections: ConnectionTypes.CornerCity,Features: {[Feature.CityBonus]: true}},
	CurveRoad: {edges: [EdgeType.Field, EdgeType.Field, EdgeType.Road, EdgeType.Road], connections: [[Dir.N, Dir.S], [Dir.E], [Dir.W]]},
	DoubleCityCorner: {edges: [EdgeType.City, EdgeType.City, EdgeType.Field, EdgeType.Field], connections: ConnectionTypes.None},
	DoubleCitySides: {edges: [EdgeType.Field, EdgeType.City, EdgeType.City, EdgeType.Field], connections: ConnectionTypes.None},
	Cloister: {edges: [EdgeType.Field, EdgeType.Field, EdgeType.Field, EdgeType.Field], connections: ConnectionTypes.None, Features: {[Feature.Cloister]: true}},
	CloisterRoad: {edges: [EdgeType.Field, EdgeType.Field, EdgeType.Road, EdgeType.Field], connections: ConnectionTypes.None, Features:{[Feature.Cloister]: true}},
	SingleCity: {edges: [EdgeType.City, EdgeType.Field, EdgeType.Field, EdgeType.Field], connections: ConnectionTypes.None},
	CitySERoad: {edges: [EdgeType.City, EdgeType.Road, EdgeType.Road, EdgeType.Field], connections: [[Dir.S, Dir.E], [Dir.N], [Dir.W]]},
	CitySWRoad: {edges: [EdgeType.City, EdgeType.Field, EdgeType.Road, EdgeType.Road], connections: [[Dir.S, Dir.W], [Dir.N], [Dir.E]]},
	CityEWRoad: {edges: [EdgeType.City, EdgeType.Road, EdgeType.Field, EdgeType.Road], connections: [[Dir.E, Dir.W], [Dir.S], [Dir.E]]},
	CityTripleRoad: {edges: [EdgeType.City, EdgeType.Road, EdgeType.Road, EdgeType.Road], connections: ConnectionTypes.None},
}

for (k in TileTypes) {
	TileTypes[k]["name"] = k
}

// Given a tile, extract the edges and rotate the edge array
// rotation is Clockwise
// There's probably a much nicer way to do this with _.js
function getRotatedEdges(tile, rotation) {
	return Array.apply(null, Array(4)).map(function(x, i) {
		// Some messiness here because negative values don't play nicely with modulo
		// Using +rotation would have CC rotation
		return tile.edges[(4+i-rotation)%4]
	})
}

assert.strictEqual(TileTypes.SingleCity[Dir.N], TileTypes.CCCR[Dir.S])

class GameBoard {
	constructor() {
		// Using sparse map for now, this is really inefficient for data that is probably going to pack tightly
		this.tiles = {}
		this.extents = [[0,0],[0,0]]
	}



	get(x, y) {
		if (!this.tiles[x]) {
			return null
		}
		return this.tiles[x][y];
	}

	put(x, y, value) {
		if (!this.tiles[x]) {
			this.tiles[x] = {};
		}

		this.tiles[x][y] = value;

		this.extents[0][0] = Math.min(this.extents[0][0], x)
		this.extents[1][0] = Math.max(this.extents[1][0], x)
		this.extents[0][1] = Math.min(this.extents[0][1], y)
		this.extents[1][1] = Math.max(this.extents[1][1], y)
	}

	isValidInsert(t, x, y, rotation) {
		if(this.get(x, y)) {
			return false;
		}

		const edges = getRotatedEdges(t, rotation);

		// TODO: ensure we hit at least one other tile
		for(var i = 0; i < 4; i++){
			const dir = DirToVec[i];

			const otherTile = this.get(x+dir[0], y+dir[1])
			if(otherTile) {
				const otherEdges = getRotatedEdges(otherTile.t, otherTile.r)

				if(edges[i] != otherEdges[oppositeDir(i)] ){
					return false;
				}
			}
		}

		return true;
	}

	tryInsertTile(t, x, y, rotation) {
		if(!this.isValidInsert(t,x,y,rotation)) {
			return false;
		}

		this.put(x, y, {t:t, r: rotation});

		return true;
	}
}

var board = new GameBoard();

assert(board.tryInsertTile(TileTypes.CCCC, 0, 0, 0))
assert(!board.tryInsertTile(TileTypes.RRRR, 1, 0, 0)) // Road doesn't fit next to city
assert(board.tryInsertTile(TileTypes.CCCC, 1, 0, 0))
assert(!board.tryInsertTile(TileTypes.CCCC, 0, 0, 0))
assert(board.tryInsertTile(TileTypes.CCCC, 1, 1, 0))
assert(board.tryInsertTile(TileTypes.SingleCity, -1, 0, 1))

console.log(board)

module.exports = {
	foo: 1,
	GameBoard: GameBoard,
	TileTypes: TileTypes,
}