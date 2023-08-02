const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const bookedData = {
  clubhouse: [{ date: "2023-08-02", bookedTime: [] }],
  tennis: [{ date: "2023-08-02", bookedTime: [] }],
};

app.get("/", (req, res) => {
  res.send("Welcome to homepage!");
});

app.post("/data", (req, res) => {
  const { date, startTime, endTime } = req.body;
  if (startTime < 10 || startTime > 21 || endTime > 22 || endTime < 11) {
    res.send({ message: "Sorry! Clubhouse is closed" });
  }
  // const dateString = date;
  // const dateObject = new Date(dateString);
  // const timestamp = dateObject.getTime();
  // console.log(dateObject,timestamp)

  let date1 = Date.now();
  let date2 = new Date(date);
  console.log(date1 - date2);
  if (date1 - date2 < 0) {
    res.send({ message: "Date is Invalid" });
  } else {
    let clubhouse = bookedData.clubhouse;
    console.log(clubhouse, date);
    let dateExist = datafordateExist(clubhouse, date);
    if (dateExist[1]) {
      let reqDate = clubhouse[dateExist[0]];
      let Time = reqDate["bookedTime"];
      console.log(Time.length, "bookedTime");
      if (Time.length > 0) {
        for (let i = startTime; i < endTime; i++) {
          if (Time.includes(i)) {
            res.send({ message: "Bookine Failed, Already Booked" });
            return 
          }
        }
      }
      for (let i = startTime; i < endTime; i++) {
        Time.push(i);
      }

      clubhouse[dateExist[0]]["bookedTime"] = Time;
      let cost = 0;
      for (let i = startTime; i < endTime; i++) {
        if (i >= 10 && i < 16) {
          cost += 100;
        } else {
          cost += 500;
        }
      }
      res.send({ message: `Booked, Rs. ${cost}` });
    }
    else{
        
    }
  }

  // fs.readFile(dataPath, "utf8", (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   let date2=''
  //   // // let clubhouse=data.clubhouse
  //   // datafordateExist(clubhouse, date)
  //   let today = Date.now();
  //   res.send(JSON.parse(data));
  // });
  // res.send(bookedData)
});

function datafordateExist(data, date) {
  for (var a = 0; a < data.length; a++) {
    console.log(data[a]);
    if (data[a].date == date) {
      return [a, true];
    }
  }
  return [-1, false];
}

app.listen(8000, () => {
  console.log("listening on 8000");
});
