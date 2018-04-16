const WAITING_MESSAGE = "Ожидайте соперника";
const PLAYER_STEP_MESSAGE = "Ваш ход";
const OPPONENT_STEP_MESSAGE = "Ход соперника";

if (!window.WebSocket) {
	document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

document.addEventListener("load", () => {
	const socket = new WebSocket("ws://localhost:8081");
	socket.onmessage = function(event) {
		const state = JSON.parse(event.data);
		invalidateState(state["started"], state["id"] === state["currentPlayerId"]);
		invalidateField(state["started"]);
	};
});

function invalidateState(gameStarted, isPlayerStep) {
	const playerStateElement = document.getElementById("gameState");
	if (!gameStarted) {
		playerStateElement.innerText = WAITING_MESSAGE
	}
	else {
		playerStateElement.innerText = isPlayerStep ? PLAYER_STEP_MESSAGE : OPPONENT_STEP_MESSAGE;
	}
}

function invalidateField(field) {
	const fieldElement = document.getElementById("gameField");
	const cells = fieldElement.children();
	for (let index = 0; index < field.length; ++index) {
		let cell = cells[index];
		if (!cell)
		{
			cell = createCell();
			fieldElement.appendChild(cell);
		}
		cell.removeChildren
	}
}

function createCell() {
	const cell = document.createElement("div");
	cell.setAttribute("class", "cell");
	return cell;
}
