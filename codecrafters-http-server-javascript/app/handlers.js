const fs = require("fs");
const { parseArgs } = require("./parsers");

function handleRoot(_, respond) {
  respond(200, '');
}

function handleEcho({ path }, respond) {
  let body = path.split("/echo/")[1];

  respond(200, body, {
    'Content-Type': 'text/plain'
  });
}

function handleUserAgent({ headers }, respond) {
  respond(200, headers["user-agent"], {
    'Content-Type': 'text/plain'
  });
}

const parsedArgs = parseArgs();
const filesRoot = parsedArgs['directory'];

function handleGetFile({ path }, respond) {
  const filePath = `${filesRoot}${path.slice('/files'.length)}`;
      
  fs.readFile(filePath, { encoding: 'binary' }, (err, fileData) => {
    if (err) {
      respond(404);
      return;
    }
    respond(200, fileData, {
      'Content-Type': 'application/octet-stream'
    });
  });
}

function handlePostFile({ path, body }, respond) {
  const filePath = `${filesRoot}${path.slice('/files'.length)}`;
    
  fs.writeFile(filePath, body, (err) => {
    if (err) {
      respond(500);
    } else {
      respond(201);
    }
  }); 
}

module.exports = {
  handleRoot,
  handleEcho,
  handleUserAgent,
  handleGetFile,
  handlePostFile,
}