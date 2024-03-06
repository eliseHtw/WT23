const express = require('express');
const router = express.Router();
const client = require('./db')
const bcrypt = require('bcrypt')
require('dotenv').config();

// test
router.get('/createtable', async(req, res) => {

    // const query = 'CREATE TABLE IF NOT EXISTS users(id SERIAL, name varchar(255), role varchar(255), PRIMARY KEY (id))'
    // "CREATE TABLE IF NOT EXISTS users(id int NOT NULL, name varchar(255), role varchar(255), PRIMARY KEY (id))"
    const anfrage = "CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name varchar(255), role varchar(255))" // die scheint zu funktionieren...
    client.query(anfrage);

    res.send({ message: "jetzt mit PostgreSQL" });
});

// login user
router.post('/login', async(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let check = await  client.query('SELECT * FROM users WHERE username = $1', [username])
    if(check.rowCount > 0) {
        let user = check.rows[0];
        let loginOk = await bcrypt.compare(password, user.password)
        if(loginOk) {
            res.send // usw....
        }
    }
})

// CRUD
// router.METHOD(PATH, HANDLER)

// create new user
router.post('/users', async(req,res) => {
    
    let username = req.body.username;
    let password = req.body.password;
    let hashPassword = await bcrypt.hash(password, 10);
    console.log('hash : ', hashPassword)
    let email = req.body.email;
    let role = req.body.role;

    let check = await client.query('SELECT * FROM users WHERE email = $1', [email])
    if(check.rowCount > 0) {
        res.send({ message: `È-Mail ${email} already exists` })
    } else {
        // const query = `INSERT INTO users(username, password, email, role) VALUES($1, $2, $3, $4) RETURNING *`;
        const query = `INSERT INTO users(username, hashPassword, email, role) VALUES($1, $2, $3, $4) RETURNING *`;

        let result = await client.query(query, [username, password, email, role]);
        // console.log('result aus DB (create)', result.rows[0])
        res.send(result.rows[0])
    }
});



module.exports = router;