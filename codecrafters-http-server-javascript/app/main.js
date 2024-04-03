const net = require("net");
const { parseRawHttpRequest } = require("./parsers");
const { handleRoot, handleEcho, handleUserAgent, handleGetFile, handlePostFile } = require("./handlers");

const server = net.createServer((socket) => {
  socket.on('data', function(data) {
    handle(socket, data);
  });
});

server.listen(4221, "localhost");

function handle(socket, data) {
  const request = parseRawHttpRequest(data.toString());
  const { path, method } = request;

  console.log("Received request:", request);

  const respond = function (code, body, headers)  {
    socket.write(`HTTP/1.1 ${code || 200} OK\r\n`);
    if (headers) {
      Object.keys(headers).forEach((key) => {
        socket.write(`${key}: ${headers[key]}\r\n`);
      });
    }  
    socket.write(`Content-Length: ${body?.length || 0}\r\n`);
    socket.write(`\r\n`);
    socket.write(body || "");
    socket.end();
  }

  if (path === "/") {
    return handleRoot(request, respond);
  } 
  
  if (path.startsWith("/echo")) {
    return handleEcho(request, respond);
  } 
  
  if (path === "/user-agent") {
    return handleUserAgent(request, respond);
  } 
  
  if (path.startsWith("/files") && method === "GET") {
    return handleGetFile(request, respond);
  }

  if (path.startsWith("/files") && method === "POST") {
    return handlePostFile(request, respond);
  }

  respond(404);
}
