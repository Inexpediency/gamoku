const PLAYERS_COUNT = 2;
const ELEMENTS_COUNT = 25;
const EMPTY_POINT_VALUE = -1; //should be less then 0

class Game {
	constructor() {
		this._started = false;
		this._currentPlayerIndex = 0;
		this._players = [];
		this._field = [];
	}

	getState() {
		return {
			currentPlayerId: this._players[this._currentPlayerIndex],
			started: this._started,
			field: JSON.stringify(this._field),
		};
	}

	started() {
		return this._started;
	}

	addPlayer(id) {
		this._players.push(id);
		this._started = this._players.length === PLAYERS_COUNT;
	}

	deletePlayer(id) {
		const index = this._players.indexOf(id);
		this._started = this._players.length === PLAYERS_COUNT;
		this._players.splice(index, 1);
		this._cleanField();
	}

	executeStep(id, point){
		const index = this._players.indexOf(id);
		if (this._currentPlayerIndex === index && this._field[point] === EMPTY_POINT_VALUE)
		{
			this._field[point] = index;
			return true
		}
		return false;
	}

	_cleanField() {
		for (let index = 0; index < ELEMENTS_COUNT; ++index) {
			this._field[index] = EMPTY_POINT_VALUE;
		}
	}
}

module.export = Game;