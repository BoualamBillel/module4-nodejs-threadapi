import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */
async function main() {
    try {
        const sequelize = await loadSequelize();
        const app = express();

        // Creation des tables
        const User = sequelize.define("user", {
            username : DataTypes.TEXT,
            email : DataTypes.TEXT,
            password : DataTypes.TEXT
        });

        const Post = sequelize.define("post", {
            title : DataTypes.TEXT,
            content : DataTypes.TEXT,
            userId : DataTypes.INTEGER
        });

        const Comment = sequelize.define("comment", {
            content : DataTypes.TEXT,
            userId : DataTypes.INTEGER,
            postId : DataTypes.INTEGER
        });

        // Association
        User.hasMany(Post, {foreignKey : "userId", as : "posts"});
        Post.belongsTo(User);

        Post.hasMany(Comment, {foreignKey : "postId", as : "comments"});

        Comment.belongsTo(User);
        Comment.belongsTo(Post);

        
        
        
        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });
        
        // Sync
        await sequelize.sync();

    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
main();