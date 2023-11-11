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
    database        : 'musicappdb'
})
   
// Get all playlists
app.get('/myplaylists', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from playlist', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from playlist table are: \n', rows)
        })
    })
})
// Add a playlist
app.post('/myplaylists', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        const inputtitle = req.body.Title;
        const inputuserid = req.body.UserID
        connection.query('INSERT INTO playlist (Title , UserID) VALUES ("?", "?")', [inputtitle,inputuserid], (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Playlist with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from playlist table are:11 \n', rows)

        })
    })
});
// Delete a playlist by id
app.delete('/myplaylists/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM playlist WHERE id = ?', [req.params.id], (err, rows) => {
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
// update a playlist
app.put('/myplaylists/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        const inputtitle = req.body.Title
        connection.query('UPDATE playlist SET Title = ?, image = ?,  WHERE id = ?', [inputtitle, req.params.id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Playist with the id: ${req.params.id} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})



// Get a playlist by id
app.get('/myplaylists/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM playlist WHERE id = ?', [req.body.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from playlist table are: \n', rows)
        })
    })
});

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))