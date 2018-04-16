const WAITING_MESSAGE = "Ожидайте соперника";
const PLAYER_STEP_MESSAGE = "Ваш ход";
const OPPONENT_STEP_MESSAGE = "Ход соперника";
const CROSS = 0;
const ZERO = 1;
const EMPTY = -1;

if (!window.WebSocket) {
	document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

window.addEventListener("load", () => {
	const socket = new WebSocket("ws://localhost:8081");
	let cellsCount = 0;
	socket.addEventListener("message", function(event) {
		const state = JSON.parse(event.data);
		invalidateState(state["started"], state["id"] === state["currentPlayerId"]);
		const field = JSON.parse(state["field"]);
		cellsCount = field.length;
		updateField(socket, field);
		invalidateCellsSize(cellsCount);
	});
	const fieldElement = getGameField();
	window.addEventListener("resize", () => {
		console.log("resize", cellsCount);
		invalidateCellsSize(cellsCount);
	});
});

function invalidateState(gameStarted, isPlayerStep) {
	const playerStateElement = document.getElementById("stateField");
	if (!gameStarted) {
		playerStateElement.innerText = WAITING_MESSAGE
	}
	else {
		playerStateElement.innerText = isPlayerStep ? PLAYER_STEP_MESSAGE : OPPONENT_STEP_MESSAGE;
	}
}

function updateField(socket, field) {
	const fieldElement = getGameField();
	const cells = fieldElement.children;
	for (let index = 0; index < field.length; ++index) {
		let cell = cells[index];
		if (!cell)
		{
			cell = createCell();
			fieldElement.appendChild(cell);
			cell.addEventListener("click", () => socket.send(index));
		}
		setCellState(cell, field[index]);
	}
	const clear = document.createElement("div");
	clear.setAttribute("class", "clear");
	fieldElement.appendChild(clear);
}

function invalidateCellsSize(cellsCount) {
	const fieldElement = getGameField();
	const rowCellsCount = Math.sqrt(cellsCount);
	const rowWidth = fieldElement.offsetWidth;
	const cellSize = rowWidth / rowCellsCount;
	const cells = fieldElement.children;
	const cellBorder = 1;
	for (let index = 0; index < cellsCount; ++index) {
		let cell = cells[index];
		cell.style.width = `${cellSize - cellBorder * 2}px`;
		cell.style.height = `${cellSize - cellBorder * 2}px`;
	}
}

function setCellState(cell, state) {
	switch (state) {
		case CROSS:
			cell.setAttribute("data-state", "cross");
			break;
		case ZERO:
			cell.setAttribute("data-state", "zero");
			break;
		case EMPTY:
			cell.setAttribute("data-state", "empty");
			break;
	}
}

function getGameField() {
	return document.getElementById("gameField");
}

function createCell() {
	const cell = document.createElement("div");
	cell.setAttribute("class", "cell");
	return cell;
}
