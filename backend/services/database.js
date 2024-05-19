
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE, 
            hashed_password TEXT,
            salt TEXT,
            email TEXT UNIQUE, 
            providerId TEXT,
            provider TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

function findUserByUsername(db,username){
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM user WHERE username = ?',
            [username],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            }
        );
    });
}
function findUserByProviderIdAndProvider(db, providerId, provider) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM user WHERE providerId = ? AND provider = ?',
            [providerId, provider],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            }
        );
    });
}
function createUser(db,username, hashed_password, salt, email, providerId, provider) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO user (username, hashed_password, salt, email, providerId, provider) VALUES (?, ?, ?, ?,?,?)',
            [username, hashed_password,salt, email, providerId, provider],
            function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                // Resolve with the ID of the newly inserted user
                resolve(this.lastID);
            }
        );
    });
}
function findUserById(db,userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM user WHERE id = ?',
            [userId],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            }
        );
    });
}
module.exports = {
    db,
    findUserByProviderIdAndProvider,
    createUser,
    findUserById,
    findUserByUsername

};
