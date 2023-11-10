const express = require('express')
var cors = require("cors");
const app = express()
const port = process.env.PORT || 3000;

// enable cors
app.use(cors())

//for the views
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('index')
})

app.get("/about", (req, res) => {
    res.render('about')
})
app.use((req, res) => {
    res.status(404).render('404')
})
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))