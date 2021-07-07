const express = require("express");

const DB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const user = req.body;
  DB.insert(user)
    .then(created => {
      res.status(201).json(created);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server issue "
      });
    });
  // do your magic!
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  let post = req.body;
  post = { ...post, user_id: id };

  postDB
    .insert(post)
    .then(created => {
      res.status(201).json(created);
    })
    .catch(error => {
      console.log({ error });
      res.status(500).json({
        errorMessage: "Server issue ",
        error
      });
    });
});

router.get("/", (req, res) => {
  DB.get()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error"
      });
    });
  // do your magic!
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
  // do your magic!
});

router.get("/:id/posts", (req, res) => {
  const id = req.params.id;

  DB.getUserPosts(id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error"
      });
    });
  // do your magic!
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  DB.remove(id)
    .then(deleted => {
      res.status(204).json(deleted);
    })
    .catch(error => {
      console.log({ error });
      res.status(500).json({
        errorMessage: "server err"
      });
    });
  // do your magic!
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const userChange = req.body;
  DB.update(id, userChange)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log("router.put('/:id',", { error });
      res.status(500).json({
        errorMessage: "Server issue"
      });
    });

  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  DB.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        // console.log(req.user);
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "server issue" });
    });

  // do your magic!
}

function validateUser(req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }

  // do your magic!
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errorMessage: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ errorMessage: "missing required text field" });
  } else {
    next();
  }
  // do your magic!
}

module.exports = router;
