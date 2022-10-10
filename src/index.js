//=====================Importing Module and Packages=====================//
const express = require('express');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const moment = require('moment');
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://Lucky:ejIoY6iVVc1sRKbS@cluster0.byhslvl.mongodb.net/test", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is Connected.."))
    .catch(error => console.log(error))

//===================== Global Middleware for All Route =====================//
app.use('/', route)

//===================== It will Handle error When You input Wrong Route =====================//
app.use(function (req, res) {
    var err = new Error("Not Found.")
    err.status = 400
    return res.status(400).send({ status: "400", msg: "Path not Found." })
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
});
