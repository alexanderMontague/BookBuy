// https://ugradcalendar.uwaterloo.ca/page/Course-Descriptions-Index

var fs = require("fs");
const path = require("path");

var lineReader = require("readline").createInterface({
  input: fs.createReadStream(path.join(__dirname, "waterloo.txt"))
});

const waterlooArr = [];

lineReader.on("line", function(line) {
  line = line.replace(/ +(?= )/g, "");

  const words = line.split(" ");
  const code = words.pop();

  const courseObj = {
    value: code,
    label: `${code} (${words.join(" ")})`
  };

  waterlooArr.push(courseObj);
});

lineReader.on("close", () => {
  fs.writeFile("waterloo.json", JSON.stringify(waterlooArr), err => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
});
