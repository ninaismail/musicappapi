const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
var cors = require("cors");

const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json())
// enable cors
app.use(cors())
// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'music'
})
   
// Get all users
app.get('/users', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from users', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from users table are: \n', rows)
        })
    })
})

// Add a user
app.post('/users', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        const inputtitle = req.body.Name;
        const inputcountry = req.body.Country;
        const inputaccountid = req.body.AccountID;
        connection.query('INSERT INTO Users (Name, Country, AccountID) VALUES ("?","?","?")', [inputtitle,inputcountry,inputaccountid], (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`User with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from user table are:11 \n', rows)

        })
    })
});
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))