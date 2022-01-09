const { Schema, model } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  tag: { type: String },
});

schema.index({title: "text"})

module.exports   = model("Schemas", schema);
