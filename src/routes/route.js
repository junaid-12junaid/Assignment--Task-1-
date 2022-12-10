const express = require('express')
const router = express.Router()

const userController=require('../controller/userController')

const studentController=require("../controller/studentController")

const { authentication } = require("../middleWare/authentication")


router.get("/test",function(req,res){
    return res.send({data:"This to test"})
})


//USER API
router.post("/User/register",userController.createUser)

router.post("/User/Login",userController.loginUser)

//STUDENT API
router.post("/Student/:userId",authentication,studentController.createStudent)

router.get("/Student/:studentId",authentication,studentController.getStudentById)

router.get("/Students/:userId",authentication,studentController.getStudentByQuery)

router.put("/Student/:studentId/user/:userId",authentication,studentController.updateStudent)

router.delete("/Student/:studentId/user/:userId",authentication,studentController.deleteStudent)



// for worng route=============================>

router.all('/*/',async function(req,res){
    return res.status(404).send({status:false,message:"Page Not Found"})
})


module.exports = router 