import express from "express";
import { createTable } from "../Helpers/tables.mjs";
import { loadSequelize } from "../Helpers/database.mjs";
import bcrypt from "bcrypt";
import { generateToken } from "../auth/auth.mjs";


const sequelize = await loadSequelize();
const { User } = await createTable(sequelize);
const router = express.Router();


router.post("/register", async (req, res) => {
    if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Les champs : Username, E-mail et Password sont requis !" });
    }

    const email = await User.findOne({ where: { email: req.body.email } });
    if (email) {
        return res.status(400).json({ message: "Cet E-Mail existe deja" });
    }

    try {
        const userCreated = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        });
        const token = generateToken(userCreated);
        const { password, ...userSafe } = userCreated.get({ plain: true });
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000
        });
        res.status(201).json({ user: userSafe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post("/login", async (req, res) => {

    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Les champs : E-mail et Password sont requis pour la connexion !" });
        }

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(401).json({ message: "Identifiants incorrect" });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Identifiants incorrect" });
        }
        const token = generateToken(user);
        const { password, ...userSafe } = user.get({ plain: true });
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000
        });
        res.status(200).json({
            message: "Connexion réussie",
            user: userSafe
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
})

export default router;