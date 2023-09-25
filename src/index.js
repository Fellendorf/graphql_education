import express from "express";
import createHttpError from "http-errors";
import { connect as connectToMongo } from "mongoose";
import { graphqlHTTP } from "express-graphql";
import "dotenv/config";
import { schema } from "./schema/schema.js";

const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

app.set("port", port);

// Routes start
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.use((req, res, next) => {
  next(createHttpError(404));
});
// Routes end

await connectToMongo(mongoUrl, {
  connectTimeoutMS: 1000,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e.message);
    process.exit();
  });

app.listen(port, (err) => {
  err ? console.log(err) : console.log("Server started");
});

