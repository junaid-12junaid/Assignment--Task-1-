const userModel = require("../Model/userModel")
const {isValid, isValidName, isValidEmail, isValidPassword, keyValid } = require('../validator/validator')


const jwt = require('jsonwebtoken')

const createUser = async function (req, res) {
    try {
        const data = req.body

        if(!keyValid(data))  return res.status(400).send({ status: false, message: "Please give the Input to Create the User" })

        const { name,  email, password } = data

        if (!isValid(name)) return res.status(400).send({ status: false, message: "name is mandatory and should have non empty String" })

        if (!isValidName.test(name)) return res.status(400).send({ status: false, message: "Please Provide name in valid formate and Should Starts with Capital Letter" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is mandatory and should have non empty String" })
 
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })

        if (await userModel.findOne({ email })) return res.status(400).send({ status: false, message: "This email is already Registered Please give another Email" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is mandatory and should have non empty String" })

        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please provide Valid password with 1st letter should be Capital letter and contains spcial character with Min length 8 and Max length 15" })


        let obj = {
            name, email,password
        }

        const newUser = await userModel.create(obj)

        return res.status(201).send({ status: true, message: "User created successfully", data: newUser })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const loginUser = async function (req, res) {
    try {
        let data = req.body
        
        if (!keyValid(data))
      return res
        .status(400)
        .send({ status: false, data: "The body Can't be Empty" });

        const { email, password } = data

        if (!keyValid(data)) return res.status(400).send({ status: false, msg: "Email and Password Required !" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is mandatory and should have non empty String" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is mandatory and should have non empty String" })

        const user = await userModel.findOne({ email: email ,password:password})

        if (!user) return res.status(400).send({ status: false, msg: "Email || pasword is Invalid Please try again !!" })

        const token = jwt.sign({
            userId: user._id.toString()
        }, "this is a private key", { expiresIn: '25h' })

        res.setHeader("x-api-key", token)

        let obj = {
            userId: user._id,
            token: token
        }

        res.status(200).send({ status: true, message: "User login successfull", data: obj })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser ,loginUser}
