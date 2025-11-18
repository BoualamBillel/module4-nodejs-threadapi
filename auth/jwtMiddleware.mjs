import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../key.mjs";

export function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé" });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // Je stocke le payload dans la requete (id = req.user.id)
        next();
    } catch (error) {
        return res.status(401).json({message: "Accès non autorisé"});
    }
}