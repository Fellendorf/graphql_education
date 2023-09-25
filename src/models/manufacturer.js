import { Schema, model } from "mongoose";

const manufacturerSchema = new Schema({
  name: String,
  foundationDate: Date,
  description: String,
  founder: String,
  headQuarterLocation: String,
});

export const Manufacturer = model("Manufacturer", manufacturerSchema);

