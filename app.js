const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Student = require("./models/student");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", ejs);

mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb");
  })
  .catch((err) => {
    console.log("Error connecting to mongodb");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("This is a homepage");
});

app.get("/students/insert", (req, res) => {
  res.render("studentInsert.ejs");
});

app.post("/students/insert", (req, res) => {
  let { id, name, age, merit, other } = req.body;
  let newStudent = new Student({
    id,
    name,
    age,
    scholarship: { merit, other },
  });
  newStudent
    .save()
    .then(() => {
      console.log("Student accepted.");
      res.render("accept.ejs");
    })
    .catch((e) => {
      console.log("Student not accepted.");
      console.log(e);
      res.render("reject.ejs");
    });
});

app.get("/students", async (req, res) => {
  try {
    let data = await Student.find();
    res.render("students.ejs", { data });
  } catch {
    res.send("Couldn't find");
  }
});
app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    if (data != null) {
      res.render("studentpage.ejs", { data });
    } else {
      res.send("Couldn't find ,try again");
    }
  } catch (e) {
    res.send("Couldn't find");
    console.log(e);
  }
});

app.get("/*", (req, res) => {
  res.status(404);
  res.send("Not allowed");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
