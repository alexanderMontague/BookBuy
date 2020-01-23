// https://academiccalendars.romcmaster.ca/content.php?catoid=38&navoid=8070

var fs = require("fs");
const path = require("path");

var lineReader = require("readline").createInterface({
  input: fs.createReadStream(
    path.join(__dirname, "../assets/courses/mcmaster.js")
  )
});

const mcmasterArr = [];
let count = 0;

lineReader.on("line", function(line) {
  count++;

  if (count === 112) {
    return;
  }

  if (count >= 113) {
    if (mcmasterArr.length === count - 113) return;

    mcmasterArr[count - 113].label = `${
      mcmasterArr[count - 113].value
    } (${line})`;
  } else {
    let courseObj = {};
    courseObj.value = line.split(" ").pop();
    mcmasterArr.push(courseObj);
  }
});

lineReader.on("close", () => {
  fs.writeFile("mcmaster.json", JSON.stringify(mcmasterArr), err => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
});
