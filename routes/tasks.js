const {Router} = require('express');
const fs = require('fs').promises;
const router = Router();

router.get('/tasks', async (req, res) => {
    //send tasks
    let dataFile = await fs.readFile('./data.json');
    let data = JSON.parse(dataFile);
    let obj = data[req.session.username];
    console.log(obj);
    res.json(obj);
})
router.post('/tasks', async (req, res) => {
    //save tasks
    let tasks = req.body;
    console.log(tasks);
    let dataFile = await fs.readFile('./data.json');
    let data = JSON.parse(dataFile);
    data[req.session.username] = tasks;
    await fs.writeFile('./data.json', JSON.stringify(data));
    res.end("success");
})

module.exports = router;