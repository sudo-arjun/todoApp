//server sent events
const app = require("express")();

app.get('/',(req,res)=>{
    res.send("Namaste sekai");
})
app.get('/stream', (req,res)=>{
    res.setHeader("content-type","text/event-stream");
    res.write("data: " + "stream is following\n\n")
    setInterval(()=>{
        res.write(`data: ${Date.now()}\n\n`);
    },2000)
})
app.listen(8080);