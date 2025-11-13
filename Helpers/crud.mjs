import { Sequelize, DataTypes } from "sequelize";
import { loadSequelize } from "./database.mjs";
import { createTable } from "./table.mjs";
import bcrypt from "bcrypt";


// Create
export async function addUser(User,username, email, password) {
    await User.create({
        username : username,
        email : email,
        password : await bcrypt.hash(password, 10)
    });
}

async function addPost(Post,title, content, userId) {
    Post.create({
        title : title,
        content : content,
        userId : userId
    });
}


// Read



// Update



// Delete