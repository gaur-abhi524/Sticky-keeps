
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    content: {
        type:String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);