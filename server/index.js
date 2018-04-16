const http = require("http");
const Static = require("node-static");
const GameSession = require("./GameSession");
const WebSocketServer = new require("ws");

const sessions = [];

const webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on("connection", function(ws) {
	for (const session of sessions) {
		if (session.addPlayer(ws)) {
			break;
		}
	}
});


const fileServer = new Static.Server("./client");
http.createServer(function (req, res) {

	fileServer.serve(req, res);

}).listen(8080);

console.log("Сервер запущен на портах 8080, 8081");

