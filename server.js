const http = require("http");
const debug = require("debug")("node-angular");
const app = require("./backend/app");

const normalizePort = val => {
	//converts the string into a base 10 number
	var port = parseInt(val, 10);
	//if it is a named pipe, return the name
	if (isNaN(port)) return val;
	//if it is a number, return the number
	if (port >= 0) return port;
	//otherwise return false
	return false;
};

const onError = err => {
	if (err.syscall !== "listen") throw err;
	const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
	switch (err.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw err;
	}
};

const onListening = () => {
	const addr = server.address();
	const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
	debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
