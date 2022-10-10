const userModel = require('../models/userModel')

const createUser = async function (req,res) {
    try {
        const data = req.body
        const savedData = await userMModel.create(data)
        return res.status(201).send({ status: true, msg: savedData})
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { createUser }