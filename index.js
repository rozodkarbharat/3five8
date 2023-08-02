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

app.post("/clubhouse", (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    if (startTime < 10 || startTime > 21 || endTime > 22 || endTime < 11) {
      res.status(400).json({ message: "Sorry! Clubhouse is closed" });
      return;
    }
    let date1 = new Date();
    date1.setUTCHours(0, 0, 0, 0);
    let date2 = new Date(date);
    if (date2 - date1 <= -1) {
      res.status(400).json({ message: "Date is Invalid" });
      return;
    } else {
      let clubhouse = bookedData.clubhouse;
      let dateExist = datafordateExist(clubhouse, date);
      if (!dateExist[1]) {
        bookedData.clubhouse.push({ date, bookedTime: [] });
        clubhouse = bookedData.clubhouse;
        dateExist = datafordateExist(clubhouse, date);
      }
      let reqDate = clubhouse[dateExist[0]];
      let Time = reqDate["bookedTime"];
      if (Time.length > 0) {
        for (let i = startTime; i < endTime; i++) {
          if (Time.includes(i)) {
            res.status(409).json({ message: "Booking Failed, Already Booked" });
            return;
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
      res.json({ message: `Booked, Rs. ${cost}` });
    }
  } catch (err) {
    res.status(500).json({ message: "Booking Failed", error: err.message });
  }
});

app.post("/tennis", (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    if (startTime < 10 || startTime > 21 || endTime > 22 || endTime < 11) {
      res.status(400).send({ message: "Sorry! Tennis club is closed" });
      return;
    }
    let date1 = new Date();
    date1.setUTCHours(0, 0, 0, 0);
    let date2 = new Date(date);
    if (date2 - date1 <= -1) {
      res.status(400).json({ message: "Date is Invalid" });
      return;
    }
    let tennis = bookedData.tennis;
    let dateExist = datafordateExist(tennis, date);
    if (!dateExist[1]) {
      bookedData.tennis.push({ date, bookedTime: [] });
      tennis = bookedData.tennis;
      dateExist = datafordateExist(tennis, date);
    }

    let reqDate = tennis[dateExist[0]];
    let Time = reqDate["bookedTime"];
    if (Time.length > 0) {
      for (let i = startTime; i < endTime; i++) {
        if (Time.includes(i)) {
          res.status(409).json({ message: "Booking Failed, Already Booked" });
          return;
        }
      }
    }
    for (let i = startTime; i < endTime; i++) {
      Time.push(i);
    }

    tennis[dateExist[0]]["bookedTime"] = Time;
    let cost = (endTime - startTime) * 50;
    res.send({ message: `Booked, Rs. ${cost}` });
  } catch (err) {
    res.status(500).json({ message: "Booking Failed", error: err.message });
  }
});

function datafordateExist(data, date) {
  for (var a = 0; a < data.length; a++) {
    if (data[a].date == date) {
      return [a, true];
    }
  }
  return [-1, false];
}

app.listen(8000, () => {
  console.log("listening on 8000");
});
