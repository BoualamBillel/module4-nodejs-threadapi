import express from "express";
import { addPost, getAllPosts, addComment, deletePostByID } from "../Helpers/crud.mjs";
import { loadSequelize } from "../Helpers/database.mjs";
import { createTable } from "../Helpers/table.mjs";

const router = express.Router();
const sequelize = loadSequelize();
const { Post, Comment } = createTable(sequelize);

router.get("/posts", async (req, res, next) => {
    try {
        const posts = await getAllPosts(Post);
        res.json(JSON.parse(posts));
    } catch (error) {
        next(error);
    }
});

router.post("/posts", async (req, res, next) => {
    try {
        const post = await addPost(Post, req.body.title, req.body.content, req.body.userId);
        res.status(201).json(post);
    } catch (error) {
        next(error);
        res.status(400).json()
    }
});

router.post("/posts/:postId/comments", async (req, res, next) => {
    try {
        const comment = await addComment(Comment, req.body.content, req.body.userId, req.params.postId);
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
});


router.post("/posts/:postId", async (req, res, next) => {
    try {
        await deletePostByID(Post, req.params.postId);
        res.status(200).json({message: `Post ID:${req.params.postId}` })
    } catch (error) {
        next(error);
    }
});