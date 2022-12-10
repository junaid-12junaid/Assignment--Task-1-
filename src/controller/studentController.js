const studentModel=require("../Model/studentModel")

const userModel = require("../Model/userModel")



const {isValid, isValidName,marksRegex,idCharacterValid, keyValid, validString } = require('../validator/validator')


const createStudent=async function(req,res){
    try {
        let userId = req.params.userId

        if (!idCharacterValid(userId)) return res.status(400).send({ status: false, message: `The given userId is not valid || The userId is mandatory` });
  
        // finding user details 
        const findUser = await userModel.findOne({ _id: userId })
        if (!findUser) return res.status(404).send({ status: false, message: `User details not found with this provided userId: ${userId}` });
 
        if(userId!==req.decodedToken) return res.status(400).send({ status: false, message: `You can't create student with other Teacher Id` });
     
        const data = req.body;
        let {marks, subject,studentName} = data;

        if (!keyValid(data)) return res.status(400).send({ status: false, data: "The body Can't be Empty" });
 
        if (!isValid(studentName)) return res.status(400).send({ status: false, message: "StudentName is mandatory and should have non empty String" })

        if (!isValidName.test(studentName)) return res.status(400).send({ status: false, message: "Please Provide name in valid formate and Should Starts with Capital Letter" })

        if (!isValid(subject)) return res.status(400).send({ status: false, message: "subject is mandatory and should have non empty String" })

        let subjects =["Maths","SocialScience","English","Art","Science"]
    if(!subjects.includes(subject)) return res.status(400).send({status:false,message:`Subjects should be among ${subjects}`})

    if (!isValid(marks)) return res.status(400).send({ status: false, message: "marks is mandatory and should have non empty String" })

        if(!marksRegex.test(marks)) return res.status(400).send({ status: false, message: "Please Provide only Numbers" })

        let findStudent=await studentModel.findOne({userId:userId, studentName:studentName,subject:subject})

        if(findStudent){
            findStudent.marks=findStudent.marks+marks
            await findStudent.save();
            return res.status(201).send({ status: true, message: `The marks is updated successfully`,data:findStudent });
        }else{
            let obj={ 
                userId:userId,
                studentName:studentName,
                marks:marks,
                subject:subject
            }
            const createStudent = await studentModel.create(obj);
            return  res.status(201).send({ status: true, data: createStudent });
        }



    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}


const getStudentById=async function(req,res){
    try {
        let studentId=req.params.studentId

        if (!idCharacterValid(studentId)) return res.status(400).send({ status: false, message: `The given studentId is not valid || The studentId is mandatory` });

        const findStudent = await studentModel.findOne({ _id: studentId })
        if (!findStudent) return res.status(404).send({ status: false, message: `student details not found with this provided studentId: ${studentId}` });

        if(findStudent.isDeleted==true) return res.status(404).send({ status: false, message: `student details are already deleted` });
 
        if(findStudent.userId.toString()!==req.decodedToken) return res.status(400).send({ status: false, message: `You can't view the other Teacher student's details`});

        return res.status(200).send({status:true,data:findStudent})

    } catch (error) {
        return res.status(500).send({ error: error.message })

    }
}

const getStudentByQuery=async function(req,res){
    try {
        let userId = req.params.userId

        if (!idCharacterValid(userId)) return res.status(400).send({ status: false, message: `The given userId is not valid || The userId is mandatory` });
  
        const findUser = await userModel.findOne({ _id: userId })
        if (!findUser) return res.status(404).send({ status: false, message: `User details not found with this provided userId: ${userId}` });
 
        if(userId!==req.decodedToken) return res.status(400).send({ status: false, message: `You can't view student details with other Teacher Id` });

        let filter = req.query;
        let query = { isDeleted: false };

        if(!keyValid(filter)){
            let arr=[]
            let findStudent=await studentModel.find({userId:userId})
            if(findStudent.length==0) return res.status(400).send({status:false,message:"No records present with the User ID"})

            for (let i = 0; i < findStudent.length; i++) {
                if(findStudent[i].isDeleted==false){
                        arr.push(findStudent[i])
                }
            }

            return res.status(200).send({status:true,totalCount:arr.length,data:arr})
        }

        if(keyValid(filter)){
            let {studentName,subject}=filter

            if (!validString(studentName)) return res.status(400).send({ status: false, message: "If you select studentName than it should have non empty" })
            if(studentName){
                const regexName = new RegExp(studentName, "i");
                query.studentName = { $regex: regexName };
            }

            if (!validString(subject)) return res.status(400).send({ status: false, message: "If you select subject than it should have non empty" })
            if(subject){
                const regexSub = new RegExp(subject, "i");
                query.subject = { $regex: regexSub };
            }
        }
        let data = await studentModel.find(query)

        if (data.length == 0) {
            return res.status(404).send({ status: true, message: "No student found with this query" });
        }

        return res.status(200).send({ status: true, message: "Success", "number of Students": data.length, data })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const updateStudent=async function(req,res){
    try {
        let studentId=req.params.studentId
       let userId=req.params.userId

        let data=req.body

        let {studentName,subject,marks}=data

        if (!idCharacterValid(studentId)) return res.status(400).send({ status: false, message: `The given studentId is not valid || The studentId is mandatory` });

        if (!idCharacterValid(userId)) return res.status(400).send({ status: false, message: `The given userId is not valid || The userId is mandatory` });

                if(userId!==req.decodedToken) return res.status(403).send({ status: false, message: `You can't edit student details with other Teacher Id` });
  
        const findUser = await studentModel.findOne({ _id:studentId,userId:userId })
        if (!findUser) return res.status(404).send({ status: false, message: `Student details not found with this provided userId and StudentId` });
        
        if(findUser.isDeleted==true) return res.status(400).send({ status: false, message: `Student is already deleted with this provided userId and StudentId` });

        if (!keyValid(data)) return res.status(400).send({ status: false, data: "The body Can't be Empty" });
        
        if (!validString(studentName)) return res.status(400).send({ status: false, message: "StudentName should have non empty String" })
        if(studentName){
       
        if (!isValidName.test(studentName)) return res.status(400).send({ status: false, message: "Please Provide name in valid formate and Should Starts with Capital Letter" })
        }

       
        if (!validString(subject)) return res.status(400).send({ status: false, message: "subject should have non empty String" })
        
            if(subject){
                let subjects =["Maths","SocialScience","English","Art","Science"]     
    if(!subjects.includes(subject)) return res.status(400).send({status:false,message:`Subjects should be among ${subjects}`})
            }

            if (!Number.isInteger(marks)) return res.status(400).send({ status: false, message: "marks should have non empty Integer" })
            if(marks){
    

        if(!marksRegex.test(marks)) return res.status(400).send({ status: false, message: "Please Provide only Numbers" })
            }

        let updateStudent=await studentModel.findOneAndUpdate({_id:studentId,userId:userId},data,{new:true})

        return res.status(200).send({ status: true, message: "Success", data: updateStudent })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const deleteStudent=async function(req,res){
    try {
        let studentId=req.params.studentId
       let userId=req.params.userId


        if (!idCharacterValid(studentId)) return res.status(400).send({ status: false, message: `The given studentId is not valid || The studentId is mandatory` });

        if (!idCharacterValid(userId)) return res.status(400).send({ status: false, message: `The given userId is not valid || The userId is mandatory` });

                if(userId!==req.decodedToken) return res.status(403).send({ status: false, message: `You can't delete student details with other Teacher Id` });
  
        const findUser = await studentModel.findOne({ _id:studentId,userId:userId })
        if (!findUser) return res.status(404).send({ status: false, message: `Student details not found with this provided userId and StudentId` });

        if(findUser.isDeleted==true) return res.status(400).send({ status: false, message: `Student is already deleted with this provided userId and StudentId` });

        await studentModel.findOneAndUpdate({_id:studentId,userId:userId},{isDeleted:true},{new:true})

        return res.status(200).send({ status: true, message: "Deleted Successfully" })

    } catch (error) {
        return res.status(500).send({ error: error.message })

    }
}
module.exports={createStudent,getStudentById,getStudentByQuery,updateStudent,deleteStudent}