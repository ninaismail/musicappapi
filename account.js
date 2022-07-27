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
   
// Get all Accounts
app.get('/accounts', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from Account', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from account table are: \n', rows)
        })
    })
})

// Add an Account
app.post('/accounts', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        const inputtitle = req.body.Email;
        connection.query('INSERT INTO Account (Email) VALUES ("?")', [inputtitle], (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Account with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from account table are:11 \n', rows)

        })
    })
});

// Get an Account by id
app.get('/accounts/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM Account WHERE AccountID = ?', [req.body.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from account table are: \n', rows)
        })
    })
});

// Delete an account by id
app.delete('/accounts/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM Account WHERE AccountID = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Account with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from Accont table are: \n', rows)
        })
    })
});
// update an account
app.put('/accounts/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as AccountID ${connection.threadId}`)
        const inputtitle = req.body.Email
        connection.query('UPDATE Account SET Email = ? WHERE AccontID = ?', [inputtitle, req.params.id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Account with the id: ${req.params.id} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))