const http = require("http");
const url = require("url");
const { home, createNotes, getNote } = require("./notes");

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === "/" && req.method === "GET") {
    home(req, res);
  } else if (reqUrl.pathname === "/note" && req.method === "GET") {
    getNote(req, res);
  } else if (reqUrl.pathname === "/note" && req.method === "POST") {
    createNotes(req, res);
  } else {
    res.end("Not Found");
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server now running on port ${port}`);
});
