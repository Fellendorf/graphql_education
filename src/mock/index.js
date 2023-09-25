// Run this script to insert mock data into mongo db

import { Car } from "../models/car.js";
import { Manufacturer } from "../models/manufacturer.js";
import { connect as connectToMongo, mongo } from "mongoose";
import data from "./db.json" assert { type: "json" };
import "dotenv/config";

try {
  await connectToMongo(process.env.MONGO_URL, {
    connectTimeoutMS: 1000,
  });
  console.log("Connected to MongoDB");

  await Car.deleteMany({});
  await Manufacturer.deleteMany({});
  console.log("Previously added Mock Data removed");

  await Car.insertMany(data.cars);
  await Manufacturer.insertMany(data.manufacturers);
  console.log("Mock Data inserted");
} catch (e) {
  console.log(e);
}

process.exit(0);

