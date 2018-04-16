const Game = require("./Game");

class GameSession {
	constructor() {
		this._players = [];
		this._game = new Game();
	}

	addPlayer(ws) {
		if (this._game.started())
		{
			return false;
		}
		const id = this._players.length;
		this._players.push(ws);
		this._game.addPlayer(id);
		ws.on("message", (point) => {
			if (this._game.started() && this._game.executeStep(id, point)) {
				this._updatePlayersState();
			}
		});
		ws.on("close", () => {
			delete this._players[id];
			this._game.deletePlayer(id);
			this._updatePlayersState();
		});
		return true;
	}

	_updatePlayersState() {
		for (const player of this._players) {
			const state = Object.assign({id: this._players.indexOf(player)}, this._game.getState());
			player.json.send(JSON.stringify(state));
		}
	}
}
module.export = GameSession;