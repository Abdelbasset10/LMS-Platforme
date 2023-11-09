require("dotenv").config()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const corsOptions = require("./config/corsConfig");

const prisma = require("./utils/prisma");

const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh");
const courseRouter = require("./routes/course");
const categoryRouter = require("./routes/category");
const chapterRouter = require("./routes/chapter");

const app = express();

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/course", courseRouter);
app.use("/category", categoryRouter);
app.use("/chapter", chapterRouter);

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
