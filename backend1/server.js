const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const initdb = require('./initdb')
// hier fehlt noch was mit initdb, so jetzt richtig?

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
app.use('/init', initdb)
app.use('/', routes); // hinter das / api oder members, mit api dann /api/members

app.listen(PORT, (error) => {
    if(error) {
        console.log('error!', error)
    } else {
        console.log(`server running on port ${PORT} ...`)
    }
})