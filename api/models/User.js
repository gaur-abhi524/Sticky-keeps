const mongoose = require("mongoose");
const passportlocalmongoose=require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim:true,
      min: 3,
      max: 20,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      sparse:true
    },
    googleId:{
        type:String
    },
  },
  { timestamps: true }
);

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", UserSchema);