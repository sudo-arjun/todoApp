const router = require("express").Router();
const fs = require('fs').promises;
const sendMail = require("../mail/sendMail");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const _dirname = "D:\\Code\\CQ\\todo";
const db = require('../db/db.js')

//login route
router.route('/login').get((req, res) => {
    if (req.session.isLoggedIn)
        res.redirect('/')
    else
        res.sendFile(_dirname + '/frontend/login.html')
}).post(async (req, res) => {
    //check credentials
    // console.log(req.body);
    // let credFile = await fs.readFile('./cred.json');
    // let cred = JSON.parse(credFile);
    // if (cred[req.body.username] && cred[req.body.username].password == req.body.password) {
    //     //grant access
    //     req.session.isLoggedIn = true;
    //     req.session.username = req.body.username;
    //     req.session.displayName = cred[req.body.username].displayName;
    //     res.redirect('/');
    console.log(req.body.username);
    let response = await db.selectDocument(req.body.username);
    console.log(response);
    if (response) {
            req.session.isLoggedIn = true;
            req.session.username = req.body.username;
            res.redirect('/');
    }
    else {
        //cred don't match
        res.send("Enter correct Cred!");
    }
    // res.sendFile(_dirname + '/frontend/home.html');

})


// logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// signup route
router.route('/signup').get((req, res) => {
    res.sendFile(_dirname + '/frontend/signup.html')
}).post(async (req, res) => {
    console.log(req.sessionID);
    console.log(req.session);
    let pass1 = req.body.pass1;
    let pass2 = req.body.pass2;
    let username = req.body.username;
    let email = username;
    if (pass1 == pass2) {
        // let credFile = await fs.readFile('./cred.json');
        // let cred = JSON.parse(credFile);
        let r = await db.selectDocument(username);
        console.log(r);
        //check username doesn't exist
        if (r == null) {
            req.session.username = username;
            req.session.password = pass1;
            req.session.uniqueCode = Math.random().toString(36).slice(2);
            console.log('in post', req.session);
            let link = `http://localhost:3000/confirm/${req.session.uniqueCode}`;
            sendMail(email, link);
            console.log("email sent");
            // eventEmitter.on('redirect',()=>{
            //     console.log("event recieved");
            //     // res.setHeader("content-type","text/event-stream");
            //     // res.write("data: " + "stream is following\n\n")
            //     // res.send({redirect: '/login'});
            //     res.send({'redirect':'/'})
            // })
            return res.send({ 'msg': "Confirm your email" });
        }
        console.log("jere")
        return res.send({ 'redirect': '/login' })
    }
    // res.redirect('/signup');
    res.send({ msg: "Password didn't match" });
})

// sendmail route
router.get('/sendmail', async (req, res) => {
    await sendMail().catch(() => {
        console.log("mail couldn't be send")
    })
    res.send("mail has been sent");

});

router.get('/wait', async (req, res) => {
    console.log("waiting for event");
    eventEmitter.on('redirect', () => {
        // console.log("event recieved");
        // res.setHeader("content-type","text/event-stream");
        // res.write("data: " + "stream is following\n\n")
        // res.send({redirect: '/login'});
        res.send({ 'redirect': '/login' })
    })
})
// confirm route
router.get('/confirm/:code', async (req, res) => {
    console.log(req.sessionID);

    console.log(req.session);
    db.insertDocument({
        email: req.session.username,
        password: req.session.password,
        taskCollection: {},
        taskSeq: []
    })
    eventEmitter.emit('redirect');
    // }
    return res.redirect('/');
    //also confirm 
})

module.exports = router;