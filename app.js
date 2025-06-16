console.log("🔥 app.js is running");


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersController = require("./controllers/userController");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const indexRouter = require("./routes/homeRoutes");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const filesAndFoldersRouter = require("./routes/filesAndFolders");
const folderRouter = require("./routes/folder");


const initializePassport = require("./config/passport-config");

initializePassport(
  passport,
  usersController.getUserByName,
  usersController.getUserByUserId,
);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const { PrismaClient } = require("@prisma/client");
const {filesAndFolders} = require("./controllers/folderController");
const PrismaSessionStore = require("@quixo3/prisma-session-store").PrismaSessionStore;

// Initialize Prisma Client i.e logging into database
const prisma = new PrismaClient();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  // ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,  // 1 day
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/files",filesAndFoldersRouter);
app.use("/folder",folderRouter);
7

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error("❌ Uncaught Exception:", err);
});
