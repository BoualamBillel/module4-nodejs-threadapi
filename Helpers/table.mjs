import { Sequelize, DataTypes } from "sequelize";
import { loadSequelize } from "./database.mjs";


// Create
/**
 * 
 * @param {Sequelize} sequelize 
 * @returns 
 */
export async function createTable(sequelize) {
    try {
        const User = sequelize.define("user", {
            username: DataTypes.TEXT,
            email: DataTypes.TEXT,
            password: DataTypes.TEXT
        });

        const Post = sequelize.define("post", {
            title: DataTypes.TEXT,
            content: DataTypes.TEXT,
            userId: DataTypes.INTEGER
        });

        const Comment = sequelize.define("comment", {
            content: DataTypes.TEXT,
            userId: DataTypes.INTEGER,
            postId: DataTypes.INTEGER
        });

        // Association
        User.hasMany(Post, { foreignKey: "userId", as: "posts" });
        Post.belongsTo(User);

        Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

        Comment.belongsTo(User);
        Comment.belongsTo(Post);
        await sequelize.sync({force:true});
        return { User, Post, Comment };

    } catch (error) {
        console.log('Erreur lors de la création des tables : ', error);
    }
}

