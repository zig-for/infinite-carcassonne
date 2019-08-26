const assert = require('assert');


var Dir = {
	N: 0,
	E: 1,
	S: 2,
	W: 3
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
	CCCC: {edges: [EdgeType.City, EdgeType.City, EdgeType.City, EdgeType.City], connections: ConnectionTypes.All},
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



assert.strictEqual(TileTypes.SingleCity[Dir.N], TileTypes.CCCR[Dir.S])

module.exports = {
	foo: 1
}