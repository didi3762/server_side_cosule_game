const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db_file_path = path.join(__dirname, "users.db");
const db = new sqlite3.Database(db_file_path, err => {
    if (err) {
        console.log(err.message);
    } else
        console.log("Successfull connected to DB");
})

module.exports = db;