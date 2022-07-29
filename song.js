const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
var cors = require("cors");

const app = express()
const port = process.env.PORT || 3002;

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
   
// Get all songs
app.get('/music', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from song', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from song table are: \n', rows)
        })
    })
})

// Add a song
app.post('/music', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const inputtitle = req.body.Name;
        const inputduration = req.body.Duration;
        connection.query('INSERT INTO song (Name , Duration) VALUES ("?","?")', [inputtitle, inputduration], (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Song with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from song table are:11 \n', rows)

        })
    })
});

// Get a song by id
app.get('/nusic/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM song WHERE SongID = ?', [req.body.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from song table are: \n', rows)
        })
    })
});

// Delete a song by id
app.delete('/music/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM song WHERE SongID = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Song with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from song table are: \n', rows)
        })
    })
});
// update a task
app.put('/music/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as SongID ${connection.threadId}`)
        const inputtitle = req.body.Name
        const inputduration = req.body.Duration
        connection.query('UPDATE song SET Name = ? , Duration = ? WHERE SongID = ?', [inputtitle,inputduration, req.params.id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Song with the id: ${req.params.id} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))