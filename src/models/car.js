import { Schema, model } from "mongoose";

const carSchema = new Schema({
  manufacturerId: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

export const Car = model("Car", carSchema);

