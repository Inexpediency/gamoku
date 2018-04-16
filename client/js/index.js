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
	const rowCellsCount = Math.sqrt(field.length);
	for (let index = 0; index < field.length; ++index) {
		let cell = cells[index];
		if (!cell)
		{
			cell = createCell(rowCellsCount, field.length, index);
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
	const cellSize = Math.floor(rowWidth / rowCellsCount);
	const cells = fieldElement.children;
	const cellBorder = 1;
	for (let index = 0; index < cellsCount; ++index) {
		let cell = cells[index];
		let widthBordersCount = 2;
		let heightBordersCount = 2;
		if (index < rowCellsCount)
		{
			heightBordersCount += 1;
		}
		if (index >= cellsCount - rowCellsCount)
		{
			heightBordersCount += 1;
		}
		if (index % rowCellsCount == 0)
		{
			widthBordersCount += 1;
		}
		if (index % rowCellsCount == rowCellsCount - 1)
		{
			widthBordersCount += 1;
		}
		cell.style.width = `${cellSize - cellBorder * widthBordersCount}px`;
		cell.style.height = `${cellSize - cellBorder * heightBordersCount}px`;
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

function createCell(rowCellsCount, cellsCount, index) {
	const cell = document.createElement("div");
	cell.setAttribute("class", "cell");
	if (index < rowCellsCount)
	{
		cell.setAttribute("data-border-top", "true");
	}
	if (index >= cellsCount - rowCellsCount)
	{
		cell.setAttribute("data-border-bottom", "true");
	}
	if (index % rowCellsCount == 0)
	{
		cell.setAttribute("data-border-left", "true");
	}
	if (index % rowCellsCount == rowCellsCount - 1)
	{
		cell.setAttribute("data-border-right", "true");
	}
	return cell;
}
