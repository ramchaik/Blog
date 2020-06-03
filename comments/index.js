const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const commentsByPostId = {};

app.use(bodyParser.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content,
  });

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log("Event - ", type);

  switch (type) {
    case "PostCreated":
      break;

    case "CommentCreated":
      break;
  }
});

app.listen(4001, () => {
  console.log("Listening at 4001");
});
