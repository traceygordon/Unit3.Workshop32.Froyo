// imports here for express and pg
const express = require('express');
const app = express();
const pg = require('pg');
const path = require('path');

const client = new pg.Client('postgres://postgres:2182@localhost:5432/acme_froyo_db')

// static routes here (you only need these for deployment)
app.use(express.static(path.join(__dirname, '..client/dist')))

// app routes here
app.get('/api/flavors', (req, res) => {
res.send('Hello World');

})

// create your init function
const init = async () => {
    await client.connect();
    app.listen(3000, () => console.log('listening on port 3000'));

}

// init function invocation
init();