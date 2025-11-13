import { Sequelize, DataTypes, json } from "sequelize";
import { loadSequelize } from "./database.mjs";
import { createTable } from "./table.mjs";
import bcrypt from "bcrypt";


// Create
export async function addUser(User, username, email, password) {
    try {
        await User.create({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10)
        });
    } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur (${username}, ${email}) : `, error);
        throw error;
    }
}

export async function addPost(Post, title, content, userId) {
    try {
       await Post.create({
            title: title,
            content: content,
            userId: userId
        });
    } catch (error) {
        console.error(`Erreur lors de la création du post (${title}) : `, error);
        throw error;
    }
}

export async function addComment(Comment, content, userId, postId) {
    try {
        await Comment.create({
            content: content,
            userId: userId,
            postId: postId
        });
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


// Update



// Delete