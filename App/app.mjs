import { loadSequelize } from "../Helpers/database.mjs";
import { addUser, addPost, addComment } from "../Helpers/crud.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import { createTable } from "../Helpers/table.mjs";
/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */
async function main() {
    try {
        const sequelize = await loadSequelize();
        const {User, Post, Comment} = await createTable(sequelize);

        const app = express();

        // Test
        await addUser(User,"test", "test@gmail.com", "b30");
        await addPost(Post, "First Thread", "Premier Thread !", 1);
        await addComment(Comment, "Cool", 1, 1);

        
        
        
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