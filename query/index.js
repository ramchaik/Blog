const express = require("express");
const bodyPartser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyPartser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("EVENT EMITTED:  type", type)

  if (type === "PostCreated") {
    console.log(" INSIDE type in Query", type)
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    console.log(" INSIDE type in Query", type)
    const { id, postId, content, status } = data;

    const post = posts[postId];
    post.comments.push({
      id,
      content,
      status,
    });
  }

  if (type === "CommentUpdated") {
    console.log(" INSIDE type in Query", type)
    const { id, postId, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    comment.content = content;
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002...");
});
