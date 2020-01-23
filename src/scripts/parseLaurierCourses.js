// https://loris.wlu.ca/register/ssb/classSearch/classSearch

var fs = require("fs");
const laurierArr = require("./courses/laurier");

const newCourses = laurierArr.map(course => {
  return {
    label: `${course.code} (${course.description})`,
    value: course.code
  };
});

fs.writeFile("laurier.json", JSON.stringify(newCourses), err => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
