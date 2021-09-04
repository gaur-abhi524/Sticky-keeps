const router = require("express").Router();
const Note = require("../models/notes");
const User = require("../models/User");

//create a note

router.post("/", async (req, res) => {
  const cors = {
    origin: "https://sticky-keeps.netlify.app"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  const newPost = new Note(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a note

router.delete("/:id", async (req, res) => {
  const cors = {
    origin: "https://sticky-keeps.netlify.app"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      await note.deleteOne();
      res.status(200).json("the note has been deleted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a note

router.get("/find/:Title", async (req, res) => {
  const cors = {
    origin: "https://sticky-keeps.netlify.app"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  try {
    const note = await Note.find({title:req.params.Title});
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all notes

router.get("/:userId", async (req, res) => {
  const cors = {
    origin: "https://sticky-keeps.netlify.app"
  };
  res.header("Access-Control-Allow-Origin", cors.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.type('application/json');
  try {
    const currentUser = await User.findById(req.params.userId);
    const userNotes = await Note.find({ userId: currentUser._id });
    res.status(200).json(userNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;