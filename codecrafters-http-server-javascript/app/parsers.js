function parseRawHttpRequest(rawRequest) {
  const lines = rawRequest.split('\r\n');
  
  // Extract request method, path, and HTTP version
  const [method, path, httpVersion] = lines[0].split(' ');
  
  // Extract headers and body
  let headers = {};
  let body = '';
  let parsingHeaders = true;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') {
      parsingHeaders = false;
      continue;
    }
    
    if (parsingHeaders) {
      const [key, value] = line.split(': ');
      headers[key.toLowerCase()] = value;
    } else {
      body += line;
    }
  }
  
  return {
    method,
    path,
    httpVersion,
    headers,
    body
  };
}

function parseArgs() {
  const args = {};
  let currentOption = null;
  
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    
    if (arg.startsWith('--')) {
      // Remove leading '--' and assign option name
      currentOption = arg.slice(2);
      args[currentOption] = true; // Initialize option with true value
    } else if (currentOption) {
      // If currentOption is set, assign the argument to it
      args[currentOption] = arg;
      currentOption = null; // Reset currentOption
    }
  }
  
  return args;
}

module.exports = {
  parseRawHttpRequest,
  parseArgs,
}