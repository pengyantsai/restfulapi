const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Student = require("./models/student");
const methodOverride = require("method-override");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//mongoose.set("useFindAndModify", false);

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

app.get("/students", async (req, res) => {
  try {
    let data = await Student.find();
    res.send(data);
  } catch {
    res.send({ message: "Student not found." });
  }
});

app.post("/students", (req, res) => {
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
      res.send({ message: "Student saved" });
    })
    .catch((e) => {
      res.status(404).send(e);
    });
});

app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    if (data != null) {
      res.send(data);
    } else {
      res.status(404).send({ message: "Student not found" });
    }
  } catch (e) {
    res.send({ message: "Couldn't find" });
    console.log(e);
  }
});

//要給全部數值才能改 put
app.put("/students/:id", async (req, res) => {
  let { id, name, age, merit, other } = req.body;
  try {
    let d = await Student.findOneAndUpdate(
      { id },
      { id, name, age, scholarship: { merit, other } },
      {
        new: true,
        runValidators: true,
        overwrite: true,
      }
    );
    res.send({ message: "successfully updated student" });
  } catch (e) {
    res.status(404).send({ message: "failure" });
    res.send(e);
  }
});

//可改單一 patch
class newData {
  constructor() {}
  setProperties(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

app.patch("/students/:id", async (req, res) => {
  let { id } = req.params;
  let newObject = new newData();
  for (let prop in req.body) {
    newObject.setProperties(prop, req.body[prop]);
  }
  try {
    let d = await Student.findOneAndUpdate({ id }, newObject, {
      new: true,
      runValidators: true,
    });
    res.send({ message: "successfully updated student" });
  } catch (e) {
    res.status(404).send({ message: "failure" });
    res.send(e);
  }
});

app.delete("/students/delete/:id", (req, res) => {
  let { id } = req.params;
  Student.deleteOne({ id })
    .then((meg) => {
      console.log(meg);
      res.send("Deleted successfully.");
    })
    .catch((e) => {
      console.log(e);
      res.send("Delete failed.");
    });
});

app.delete("/students/delete", (req, res) => {
  let { id } = req.params;
  Student.deleteMany({})
    .then((meg) => {
      console.log(meg);
      res.send("Deleted successfully.");
    })
    .catch((e) => {
      console.log(e);
      res.send("Delete failed.");
    });
});

app.get("/*", (req, res) => {
  res.status(404);
  res.send("Not allowed");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
