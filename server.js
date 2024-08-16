const express = require('express');
const app = express();
const session = require('express-session')
app.use(express.static('frontend/static'))
app.use(express.json());
app.use(session({
    secret: 'inu neko',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))
const db = require('./db/db.js')
db.connect();

//routes
const tasksRoute = require('./routes/tasksDb.js');
const authRoutes = require('./routes/auth.js');
app.use(authRoutes);
app.use(tasksRoute);

app.get('/', (req, res) => {
    if (req.session.isLoggedIn)
        res.sendFile(__dirname + '/frontend/home.html');
    else
        res.redirect('./login');
})

app.listen(3000, () => {
    console.log("server listening at 3000");
})