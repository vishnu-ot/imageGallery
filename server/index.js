const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  const imagesPath = path.join(__dirname, "public", "images");

  fs.readdir(imagesPath, (err, files) => {
    if (err) {
      console.error("Error reading images directory", err);
      res.status(500).send("Error reading images directory");
    } else {
      res.json({ images: files });
    }
  });
});

app.post("/", upload.single("file"), function (req, res) {
  res.status(200).json({ message: "image uploaded successfully" });
});

app.listen(3000, () => console.log("server running on port 3000"));
