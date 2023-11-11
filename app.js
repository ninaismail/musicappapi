var cors = require("cors");
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const morgan = require('morgan');

const app = express()
const port = process.env.PORT || 3000;

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

//for the views
app.set('view engine', 'ejs')

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


// Get all songs
app.get("/allsongs", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM song', (err, rows) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            console.log('The data from song table are: \n', rows);
            // Now, you can render the view with the 'rows' data
            res.render('index', { title: 'Home', songs: rows });
        });
    });
});


app.get("/about", (req, res) => {
    res.render('about', { title: 'About' });
})
app.use((req, res) => {
    res.status(404).render('404')
})
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))