import { Sequelize, DataTypes } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
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
            content: DataTypes.TEXT
        });

        const Comment = sequelize.define("comment", {
            content: DataTypes.TEXT,
        });

        // Association
        User.hasMany(Post, { foreignKey: "userId", as: "posts" });
        Post.belongsTo(User);

        Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

        Comment.belongsTo(User);
        Comment.belongsTo(Post);
        await sequelize.sync();
        return { User, Post, Comment };

    } catch (error) {
        console.error("Erreur lors de la création des tables SQL : ", error);
        throw error;
    }
} 