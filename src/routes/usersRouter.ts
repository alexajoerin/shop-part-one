// require the express module

import express from "express";
import { getClient } from "../db";
import User from "../models/User";
import { ObjectId } from "mongodb";
const usersRouter = express.Router();
const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// endpoints go here

usersRouter.get("/users", async (req, res) => {
  try {
    const client = await getClient();
    const cursor = client.db().collection<User>("users").find();
    const results: User[] = await cursor.toArray();
    res.status(200).json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

usersRouter.get("/users/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client.db().collection<User>("users").findOne({ _id });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

usersRouter.post("/users", async (req, res) => {
  try {
    const newUser: User = req.body;
    const client = await getClient();
    client.db().collection<User>("users").insertOne(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    errorResponse(err, res);
  }
});

usersRouter.put("/users/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const updatedUser: User = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ _id }, updatedUser);
    if (result.matchedCount) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

usersRouter.delete("/users/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ _id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default usersRouter;
