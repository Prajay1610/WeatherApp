const http = require("http");
const fs = require("fs");
const requests = require("requests");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
// const searchInput = document.querySelector("[data-search]");
// const searchbutton = document.querySelector("[data-btn]");
// const Form = document.querySelector("[data-form]");
// const searchButton = document.getElementsByClassName("searchbtn");

let searchValue = "pune"; //change value here so taht we can get different city weathers

// Form.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log(searchInput.value);
// });

console.log(searchValue);
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=384102a2d177e39cb0c7d40ad50185df`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        // res.write(realTimeData);
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(8000, "127.0.0.1");
