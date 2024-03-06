const express = require('express');
const router = express.Router();
const client = require('./db')
const bcrypt = require('bcrypt')
require('dotenv').config();

router.get('/createtable', async(req,res) => {
    await client.query('DROP TABLE IF EXISTS users; CREATE TABLE users(id serial PRIMARY KEY, username VARCHAR(50), password VARCHAR(255), email VARCHAR(50), role VARCHAR(50));')
    res.send({ message: `table users in database ${process.env.PGDATABASE} created`})

})

// login user
router.post('/login', async(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let check = await client.query('SELECT * FROM users WHERE username = $1', [username])
    if(check.rowCount > 0) {
        let user = check.rows[0];
        let loginOk = await bcrypt.compare(password, user.password)
        if(loginOk) {
            res.send({ message: `user ${username} logged in`})
        } else {
            res.send({ message: 'wrong password'})
        }
    }
    
})

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
        res.send({ message: `E-Mail ${email} already exists`})
    } else {
        const query = `INSERT INTO users(username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *`;

        let result = await client.query(query, [username, hashPassword, email, role]);
        res.send(result.rows[0])
    }
})

// get all users
router.get('/users', async(req, res) => {
    const query = `SELECT * FROM users `;

    try {
        const result = await client.query(query)
        console.log(res)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});

// get one user via id
router.get('/users/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE id=$1`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if (result.rowCount == 1)
            res.send(result.rows[0]);
        else
            res.send({ message: "No user found with id=" + id });
    } catch (err) {
        console.log("error", err.stack)
    }
});


// update one user
router.put('/users/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE id=$1`;
    let id = req.params.id;
    const result = await client.query(query, [id])
    if(result.rowCount > 0) {
        let user = result.rows[0];
        let username = (req.body.username) ? req.body.username : user.username;
        let password = (req.body.password) ? req.body.password : user.password;
        let email = (req.body.email) ? req.body.email : user.email;
        let role = (req.body.role) ? req.body.role : user.role;

        const updatequery = `UPDATE users SET 
            username = $1, 
            password = $2,
            email = $3,
            role = $4
            WHERE id=$5
            RETURNING *;`;

        const updateresult = await client.query(updatequery, [username, password, email, role, id]);
        console.log('updateresult : ', updateresult)
        res.send(updateresult.rows[0]);

    } else {
        res.status(404)
        res.send({
            error: "User with id=" + id + " does not exist!"
        })
    }
});



module.exports = router;