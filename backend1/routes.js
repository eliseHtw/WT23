const express = require('express');
const router = express.Router();
const client = require('./db')

// router.METHOD(PATH, HANDLER)

router.get('/test', async(req, res) => {
    res.send({ message: "Hello FIW!" })
})

// hier kommt später CRUD rein
// router.METHOD(PATH, HANDLER)

// get all members - Read all
router.get('/members', async(req, res) => {
    const sqlStatement = `SELECT * FROM members `;

    try {
        const result = await client.query(sqlStatement)
        console.log(res)
        res.send(result.rows);
        // eigenes Objekt zb: res.send({ message: `$ ....` hier irgendwas was datensätze zählt... "message": "5 Datensätze sind enthalten"})
        // res.status(200) oder so, siehe doku
    } catch (err) {
        console.log('error -select', err.stack)
    }
});

// post one member - Create
router.post('/members', async(req, res) => {
    let firstname = (req.body.firstname) ? req.body.firstname : null;
    let lastname = (req.body.lastname) ? req.body.lastname : null;
    let email = (req.body.email) ? req.body.email : null;

    let exists = await client.query('SELECT * FROM members WHERE lastname = $1', [lastname])
    console.log('rowCount : ', exists.rowCount)
    if(exists.rowCount > 0) {
        res.send({ message: 'lastname already exists'})
    } else {
        const sqlStatement = `INSERT INTO members(firstname, lastname, email) VALUES ($1, $2, $3) RETURNING *`;

        try {
            const result = await client.query(sqlStatement, [firstname, lastname, email])
            console.log(res)
            res.send(result.rows[0]);
        } catch (err) {
            console.log(err.stack)
        }
    }

});

// delete one member via id
// /members/vorname/11/freiheit
router.delete('/members/:id', async(req, res) => {
// router.delete('/members/vorname/:id/:la', async(req, res) => {

    const query = `DELETE FROM members WHERE id=$1`;

    try {
        const idParam = req.params.id;
        // const lastnameParam = req.params.la;
        // console.log(' la = ', lastnameParam)
        // console.log(' id = ', idParam)
        const result = await client.query(query, [idParam])
        console.log(result)
        if (result.rowCount == 1)
            res.send({ message: "Member with id=" + idParam + " deleted" });
        else
            res.send({ message: "No member found with id=" + idParam });
    } catch (err) {
        console.log(err.stack)
    }
});

// update one member
router.put('/members/:id', async(req, res) => {
    const query = `SELECT * FROM members WHERE id=$1`;

    let id = req.params.id;

//    try {
        // let id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if(result.rowCount > 0) {
            let member = result.rows[0];
            let firstname = (req.body.firstname) ? req.body.firstname : member.firstname;
            let lastname = (req.body.lastname) ? req.body.lastname : member.lastname;
            let email = (req.body.email) ? req.body.email : member.email;

            const updatequery = `UPDATE members SET 
                firstname = $1, 
                lastname = $2,
                email = $3
                WHERE id=$4;`;
            const updateresult = await client.query(updatequery, [firstname, lastname, email, id]);
            console.log(updateresult)
            res.send({ id, firstname, lastname, email });
        } else {
            res.status(404)
            res.send({
                error: "Member with id=" + id + " does not exist!"
            })
        }
        
//    } catch (err) {
//        console.log('err : ', err)
//    }
});

module.exports = router;