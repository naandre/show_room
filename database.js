import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database("show_room.db");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        lastName TEXT NOT NULL, 
        email TEXT NOT NULL, 
        profile_image TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Password_User (
        id TEXT PRIMARY KEY, 
        user_id TEXT NOT NULL, 
        password TEXT NOT NULL,
        date_created DATE NOT NULL
    )`);
});

