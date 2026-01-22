require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const notesRoute = require("./src/routes/NotesRoutes");
const authRoute = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// Serve frontend (static)
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// routes
app.use("/api/notes", notesRoute);
app.use("/auth", authRoute);

// db connect
connectDB();

// listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
