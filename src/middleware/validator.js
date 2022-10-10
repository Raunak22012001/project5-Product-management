const UserModel = require('../models/userModel')

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
        let userDetails = req.body
        let { fname, lname, email, profileImage, phone, password, address, ...rest } = { ...userDetails };
        let { shipping, billing } = { ...address }

        if (Object.keys(rest) != 0) return res.status(400).send({ status: false, msg: "Please provide required details only => title, name, phone, email, password & address" })
        if (Object.keys(userDetails) == 0) return res.status(404).send({ status: false, msg: "Please provide details" })

        if (!fname) return res.status(400).send({ status: false, msg: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, msg: "lname is required" })
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        // if (!profileImage) return res.status(400).send({ status: false, msg: "profileImage is required" })
        if (!phone) return res.status(400).send({ status: false, msg: "phone is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        if (!shipping.street) return res.status(400).send({ status: false, msg: "shipping street is required" })
        if (!shipping.city) return res.status(400).send({ status: false, msg: "shipping city is required" })
        if (!shipping.pincode) return res.status(400).send({ status: false, msg: "shipping pincode is required" })
        if (!billing.street) return res.status(400).send({ status: false, msg: "billing street is required" })
        if (!billing.city) return res.status(400).send({ status: false, msg: "billing city is required" })
        if (!billing.pincode) return res.status(400).send({ status: false, msg: "billing pincode is required" })

        let [ Fname, Lname, Email, Phone, Password ] = [isValidName(fname), isValidName(lname), isValidEmail(email), isValidPhone(phone), isValidPassword(password)];

        if (!Fname) return res.status(400).send({ status: false, msg: "Invalid fname" })
        if (!Lname) return res.status(400).send({ status: false, msg: "Invalid lname" })

        const isEmailAlreadyUsed = await UserModel.findOne({ email })
        if (isEmailAlreadyUsed) return res.status(404).send({ status: false, msg: "Email is already used" })
        if (!Email) return res.status(400).send({ status: false, msg: "Invalid email" })

        const isPhoneAlreadyUsed = await UserModel.findOne({ phone })
        if (isPhoneAlreadyUsed) return res.status(404).send({ status: false, msg: "Phone is already used" })
        if (!Phone) return res.status(400).send({ status: false, msg: "Invalid phone" })

        if (!Password) return res.status(400).send({ status: false, msg: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character" })

        next();

    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}

//////////////////////////////////////////// Login Validation /////////////////////////////////////////////////////////////

const logInValidation = async function (req, res, next) {
    try {
        let data = req.body
        let { email, password, ...rest } = { ...data }

        if (Object.keys(rest) != 0) return res.status(400).send({ status: false, msg: "please provide EmaliId and Password only" })
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "Please provide details" })

        if (!email || !password) return res.status(400).send({ status: false, msg: "Please enter email and password both" })

        next();
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}


module.exports = { userValidation, logInValidation }