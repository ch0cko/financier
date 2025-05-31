// import important modules to for storing and reading files
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const bodyParser = require("body-parser");
const path = require("path");

const uri = "mongodb+srv://marcraviz:amazinglovemr@financier.nclbdxk.mongodb.net/?retryWrites=true&w=majority&appName=financier";
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const app = express();
const port = 3000;

// Add body-parser middleware to parse JSON and urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: "financier1024",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

app.get("/test", (req, res) => {
    console.log("Test route accessed");
    res.send("Test route is working");
});

const users = require("./routes/users");
app.use("/", users);

const signupRouter = require("./routes/signuplogin");
app.use("/", signupRouter);

const goalRouter = require("./routes/goalsetup");
app.use("/", goalRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
