import { loadSequelize } from "../Helpers/database.mjs";
import { createTable } from "../Helpers/tables.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */
async function main() {
    try {
        const sequelize = await loadSequelize();
        const app = express();

        //Test
        createTable(sequelize);





        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });


    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
main();