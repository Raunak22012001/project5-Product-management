const UserModel = require('../model/userModel')

const isValidName = function (body) {
    const nameRegex = /^[a-zA-Z_ ]*$/;
    return nameRegex.test(body)
}

const isValidPhone = function (body) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(body)
}

const isValidEmail = function (body) {
    const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(body)
}

const isValidPassword = function (body) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
    return passwordRegex.test(body)
}

/////////////////////////////////////////////////// userValidation /////////////////////////////////////////////////////////

const userValidation = async function (req, res, next) {
    try {

    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}
