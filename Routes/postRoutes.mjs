import express from "express";
import { createTable } from "../Helpers/tables.mjs";
import { loadSequelize } from "../Helpers/database.mjs";
import { verifyToken } from "../auth/jwtMiddleware.mjs";


const sequelize = await loadSequelize();
const { Post } = await createTable(sequelize);
const { Comment } = await createTable(sequelize);

const router = express.Router();

router.post("/posts", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const post = await Post.create({
            "title": req.body.title,
            "content": req.body.content,
            "userId": userId
        });
        if (post){
            res.status(201).json({
                "message": "Post crée avec succès",
                "Post": post
            });
        } else {
            res.status(404).json({comment: "Erreur lors de la création du post"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ association: "comments" }]
        });
        if (posts.length > 0) {
            res.status(200).json({
                AllPostsAndComments: posts
            });
        } else {
            res.status(404).json({ message: "Erreur lors de la récupération de tout les posts et leurs commentaires" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post("/posts/:postId/comments", verifyToken, async (req, res) => {
    try {
        if (!req.body || !req.body.content) {
            return res.status(400).json({ message: "Un commentaire doit avoir un contenu" });
        }
        const comment = await Comment.create({
            "content": req.body.content,
            "postId": req.params.postId,
            "userId": req.user.id
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.delete("/posts/:postId", verifyToken, async (req, res) => {
    try {
        const deleted = await Post.destroy({ where: { id: req.params.postId } });
        if (deleted) {
            res.status(200).json({ message: "Post supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Erreur lors de la suppresion du post" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.delete("/comments/:commentId", verifyToken, async (req, res) => {
    try {
        const deleted = await Comment.destroy({ where: { id: req.params.commentId } });
        if (deleted) {
            res.status(200).json({ message: "Commentaire supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Erreur lors de la suppresion du commentaire" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/users/:userId/posts", async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { userId: req.params.userId }
        });
        if (userPosts.length > 0) {
            res.status(200).json(userPosts);
        } else {
            res.status(404).json({ message: "Erreur lors de la récupération des posts de l'utilisateur" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;

