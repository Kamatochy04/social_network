const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
require("dotenv").config();

const userRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");
const authRouter = require("./routes/auth.js");
const commentsRouter = require("./routes/comments.js");
const likesRouter = require("./routes/likes.js");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieparser());

app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/likes", likesRouter);

app.listen(8000, () => {
  console.log("Port started on port " + PORT);
});
