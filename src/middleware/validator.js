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
        let userDetails = req.body
        let { fname, lname, email, profileImage, phone, password, ...rest } = { ...userDetails };

        if (Object.keys(rest) != 0) return res.status(400).send({ status: false, msg: "Please provide required details only => title, name, phone, email, password & address" })
        if (Object.keys(userDetails) == 0) return res.status(404).send({ status: false, msg: "Please provide details" })

        if (!fname) return res.status(400).send({ status: false, msg: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, msg: "lname is required" })
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!profileImage) return res.status(400).send({ status: false, msg: "profileImage is required" })
        if (!phone) return res.status(400).send({ status: false, msg: "phone is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        let [ Fname, Lname, Email, Phone, Password ] = [isValidName(fname), isValidName(lname), isValidEmail(email), isValidPhone(phone), isValidPassword(password)];

        if (!Fname) return res.status(400).send({ status: false, msg: "Invalid fname" })
        if (!Lname) return res.status(400).send({ status: false, msg: "Invalid lname" })

        
        if (!Phone) return res.status(400).send({ status: false, msg: "Invalid phone" })
        
        const isEmailAlreadyUsed = await UserModel.findOne({ email })
        if (isEmailAlreadyUsed) return res.status(404).send({ status: false, msg: "Email is already used" })

        const isPhoneAlreadyUsed = await UserModel.findOne({ phone })
        if (isPhoneAlreadyUsed) return res.status(404).send({ status: false, msg: "Phone is already used" })
        

        if (!Password) return res.status(400).send({ status: false, msg: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character" })

        next();

    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}
