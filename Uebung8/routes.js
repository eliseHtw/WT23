const express = require('express');
const router = express.Router();
const client = require('./db');
require('dotenv').config();

// test
router.get('/test', async(req, res) => {
    res.send({ message: "jetzt mit PostgreSQL" });
});

// create table
router.get('/createtable', async(req, res) => {
    let anfrage = `
        DROP TABLE IF EXISTS users; 
        CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(255), 
        password VARCHAR(255), email VARCHAR(255), role VARCHAR(255));
        `;
    client.query(anfrage);
    
    res.send({ message: `table users in database ${process.env.PGDATABASE} created`});
});

// CRUD
// router.METHOD(PATH, HANDLER)

// create new user

router.post('/users', async(req, res) => {
    let username = (req.body.username) ? req.body.username : null;
    let password = (req.body.password) ? req.body.password : null;
    let email = (req.body.email) ? req.body.email : null;
    let role = (req.body.role) ? req.body.role : null;

    let checkmail = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    let checkname = await client.query(`SELECT * FROM users WHERE username = $1;`, [username]);
    if (checkmail.rowCount > 0) {
        res.send({ message: `E-Mail ${email} already exists` });
    } else if (checkname.rowCount > 0) {
        res.send({ message: `Name ${username} already exists` });
    } else {
        const anfrage = `INSERT INTO users(username, password, email, role) VALUES($1, $2, $3, $4) RETURNING *;`;
        try {
            const result = await client.query(anfrage, [username, password, email, role]);
            console.log('result', result.rows[0]);
            res.send(result.rows[0]);
        } catch (err) {
            console.log(err.stack);
        }
    }
});

// get all users
router.get('/users', async(req, res) => {
    const anfrage = `SELECT * FROM users;`;

    try {
        const result = await client.query(anfrage);
        console.log(res);
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack);
    }
});

// get one user via id
router.get('/users/id/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE id=$1;`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res.send({ message: "No user found with id=" + id });
        }
    } catch (err) {
        console.log("error", err.stack);
    }
});

// get user by name
router.get('/users/:username', async(req, res) => {
    const anfrage = `SELECT * FROM users WHERE username=$1;`;

    try {
        const username = req.params.username;
        const result = await client.query(anfrage, [username]);
        console.log(result);
        if (result.rowCount == 1) {
            res.send(result.rows[0]);
        } else {
            res. send({ message: "No user found with username=" + username });
        }
    } catch (err) {
        console.log("error", err.stack);
    }
});

// delete user by id
router.delete('/users/:id', async(req, res) => {
    const anfrage = `DELETE FROM users WHERE id=$1;`;

    try {
        const id = req.params.id;
        const result = await client.query(anfrage, [id])
        console.log(result)
        if (result.rowCount == 1) {
            res.send({ message : "User with id=" + id + " deleted" });
        } else {
            res.send({ message: "No user found with id=" + id});
        }
    } catch (err) {
        console.log(err.stack);
    }
});

// change data of user with id
router.put('/users/:id', async(req, res) => {
    const anfrage = `SELECT * FROM users WHERE id=$1;`;

    let id = req.params.id;
    const result = await client.query(anfrage, [id]);
    if (result.rowCount > 0) {
        let user = result.rows[0];
        let username = (req.body.username) ? req.body.username : null;
        let password = (req.body.password) ? req.body.password : null;
        let email = (req.body.email) ? req.body.email : null;
        let role = (req.body.role) ? req.body.role : null;

        const updateanfrage = `UPDATE users SET
                username = $1,
                password = $2,
                email = $3,
                role = $4
                WHERE id=$5;`;
        
        const updateresult = await client.query(updateanfrage, [username, password, email, role, id]);
        console.log(updateresult);
        res.send({ id, username, password, email, role });
    } else {
        res.status(404);
        res.send({
            error: "User with id=" + id + " does not exist!"
        });
    }
});

module.exports = router;