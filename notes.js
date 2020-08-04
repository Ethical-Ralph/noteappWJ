const fs = require("fs");
const path = require("path");
const url = require("url");

const bodyParser = (req, cb) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    cb(JSON.parse(body));
  });
};

exports.home = async (req, res) => {
  req.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const message = JSON.stringify({ message: "welcome to my note app" });
  res.end(message);
};

exports.createNotes = async (req, res) => {
  bodyParser(req, (data) => {
    if (
      data.title === undefined ||
      data.description === undefined ||
      data.directory === undefined
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      const message = JSON.stringify({
        message: "Input all fields",
      });
      return res.end(message);
    }
    if (
      data.title.length === 0 ||
      data.description.length === 0 ||
      data.directory.length === 0
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      const message = JSON.stringify({
        message: "Fieild Cant be empty",
      });
      return res.end(message);
    }

    if (!fs.existsSync(data.title)) {
      fs.mkdirSync(`Notes/${data.directory}`, {
        recursive: true,
        mode: 0o77,
      });
    }
    res.statusCode = 201;
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    const message = JSON.stringify({
      message: "Note created successfully",
    });
    res.end(message);
    let directory = data.directory;
    if (data.title.length !== 0) {
      fs.appendFileSync(
        `Notes/${directory}/${data.title}.txt`,
        `${data.description}\n`,
        "utf8"
      );
    }
  });
};

exports.getNote = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const reqUrl = url.parse(req.url, true);
  const filePath = path.join(__dirname, "./Notes");

  try {
    if (!reqUrl.query.directory || !reqUrl.query.title) {
      res.statusCode = 400;
      let message = JSON.stringify({ message: "Query data missing" });
      res.end(message);
    }
    const data = fs.readFileSync(
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`
    );

    let folderName =
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`;
    let fileName = `${reqUrl.query.title}.txt`;
    const message = JSON.stringify({
      folderName,
      fileName,
      data: data.toString(),
    });
    res.end(message);
  } catch (err) {
    res.statusCode = 404;
    const message = JSON.stringify({
      error: `No such file or directory exists`,
      folderName:
        filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`,
    });
    res.end(message);
  }
};
