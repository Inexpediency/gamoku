const Game = require("./Game");

class GameSession {
	constructor() {
		this._players = new Map();
		this._game = new Game();
	}

	addPlayer(ws) {
		if (this._game.started())
		{
			return false;
		}
		const id = Math.random();
		this._players.set(id, ws);
		this._game.addPlayer(id);
		ws.on("message", (point) => {
			if (this._game.started() && this._game.executeStep(id, point)) {
				this._updatePlayersState();
			}
		});
		ws.on("close", () => {
			this._players.delete(id);
			this._game.deletePlayer(id);
			this._updatePlayersState();
		});
		this._updatePlayersState();
		return true;
	}

	_updatePlayersState() {
		for (const [id, player] of this._players) {
			const state = Object.assign({id}, this._game.getState());
			player.send(JSON.stringify(state));
		}
	}
}
module.exports = GameSession;