const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Lucky:ejIoY6iVVc1sRKbS@cluster0.byhslvl.mongodb.net/test", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is Connected."))
    .catch(error => console.log(error))

app.use('/', route)

app.use(function (req, res) {
    var err = new Error("Not Found.")
    err.status = 400
    return res.status(400).send({ status: false, msg: "Path not Found." })
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
});