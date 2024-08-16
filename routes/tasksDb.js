const { Router } = require('express');
const db = require('../db/db.js')
const fs = require('fs').promises;
const router = Router();

router.get('/tasks', async (req, res) => {
    //send tasks
    let obj = await db.selectDocument(req.session.username);
    // let dataFile = await fs.readFile('./data.json');
    // let data = JSON.parse(dataFile);
    // let obj = data[req.session.username];
    // console.log(obj);
    let result = {
        taskCollection: obj.taskCollection,
        taskSeq: obj.taskSeq
    };
    console.log(result);
    res.json(result);
})

router.post('/tasks', async (req, res) => {
    //save tasks
    let tasks = req.body;
    console.log(tasks);
    // let dataFile = await fs.readFile('./data.json');
    // let data = JSON.parse(dataFile);
    // data[req.session.username] = tasks;
    // await fs.writeFile('./data.json', JSON.stringify(data));
    await db.updateDocument({ email: req.session.username }, {
        taskCollection: tasks.taskCollection,
        taskSeq: tasks.taskSeq
    })
    res.end("success");
})

module.exports = router;