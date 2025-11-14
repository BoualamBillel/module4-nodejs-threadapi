import { Sequelize, DataTypes, json } from "sequelize";
import { loadSequelize } from "./database.mjs";
import { createTable } from "./table.mjs";
import bcrypt from "bcrypt";


// Create
export async function addUser(User, username, email, password) {
    try {
        const newUser = await User.create({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10)
        });
        return newUser;
    } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur (${username}, ${email}) : `, error);
        throw error;
    }
}

export async function addPost(Post, title, content, userId) {
    try {
        const newPost = await Post.create({
            title: title,
            content: content,
            userId: userId
        });
        return newPost;
    } catch (error) {
        console.error(`Erreur lors de la création du post (${title}) : `, error);
        throw error;
    }
}

export async function addComment(Comment, content, userId, postId) {
    try {
        const newComment = await Comment.create({
            content: content,
            userId: userId,
            postId: postId
        });
        return newComment;
    } catch (error) {
        console.error(`Erreur lors de la création du commentaire (${content}) : `, error);
        throw error;
    }
}


// Read
export async function getAllUsers(User) {
    try {
        const res = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                { association: 'posts', include: [{ association: 'comments' }] }
            ]
        });
        return JSON.stringify(res);
    } catch (error) {
        console.error(`Erreur lors de la récupération des utilisateurs : `, error);
        throw error;
    }
}

export async function getAllPosts(Post) {
    try {
        const res = await Post.findAll({
            include: [
                { association: 'comments' },
                { association: 'user' }
            ]
        });
        return JSON.stringify(res);
    } catch (error) {
        console.error(`Erreur lors de la récupération de tout les posts : `, error);
        throw error;
    }
}

export async function getAllComments(Comment) {
    try {
        const res = await Comment.findAll({
            include: [
                { association: 'user' },
                { association: 'post' }
            ]
        });
        return JSON.stringify(res);
    } catch (error) {
        console.error(`Erreur lors de la récupération de tout les commentaires : `, error);
        throw error;
    }
}


export async function getUserById(User, userId) {
    try {
        const res = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { association: 'posts', include: [{ association: 'comments' }] }
            ]
        }
        );
        return JSON.stringify(res);
    } catch (error) {
        console.error(`Erreur de la récupération de l'utilisateur avec l'id (${userId}) : `, error);
        throw error;
    }
}


// Update



// Delete
export async function deletePostByID(Post, postId) {
    try {
        await Post.destroy({
            where: {
                id: postId
            }
        });
    } catch (error) {
        console.error(`Erreur lors de la suppression du post avec l'id (${postId}) : `, error);
        throw error;
    }
}

export async function deleteCommentById(Comment, commentId) {
    try {
        await Comment.destroy({
            where: {
                id: commentId
            }
        });
    } catch (error) {
        console.error(`Erreur lors de la suppression du commentaire avec l'id (${commentId}) : `, error);
        throw error;
    }
}