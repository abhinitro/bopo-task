const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user=require("./user.model");

const { validationResult } = require('express-validator');




module.exports = {
    register
    ,Login
    ,getById
    ,getList
};









async function register(req,res) {
     let userParam=req.body;
     const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
     if (!errors.isEmpty()) {
        res.status(400).json({  status: 400,errors: errors.array() });
        return;
      }
     userParam['password']=bcrypt.hashSync(userParam.password, 10);
     let model=await user.findByEmail( userParam['email']);
     console.log("fffffffffff",model);
     if(model.length!=0){
         console.log("cccccc",model);
        return res.status(400).json( {
            status: 400,
            msg: "User is already exist"

        }); 

     }
    const result = await user.create(userParam);
   return res.status(200).json( {
        status: 200,
        msg: "User is created"
    }); 
}


async function Login(req,res) {
    console.log("In Login");

    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
     if (!errors.isEmpty()) {
        res.status(400).json({  status: 400,errors: errors.array() });
        return;
      }
      let model=await user.findByEmail( req.body.email);
      if(model.length==0){
          console.log("cccccc",model);
         return res.status(400).json( {
             status: 400,
             msg: "User is not exist"
 
         }); 
 
      }
      if (model && bcrypt.compareSync(req.body.password, model[0].password)) {

        console.log("------------------------------------------->",model[0].id);
        const {
            hash,
            ...userWithoutHash
        } = model[0];
        const token = jwt.sign({
            sub: model[0].id,
            model:model[0]
        }, config.secret);
        

        return res.status(200).json( 
            {
                ...userWithoutHash,
                token
            }
        ); 
    }


    return res.status(400).json( 
        {
            message:"User not Found"
        }
    ); 

}


async function getById(id){

    let model=await user.findById(id);

    if(model){
        return true;
    }

    return false;
}


 async function getList(req,res){

   let model = await user.getList(req.body);

   return res.status(200).json( {
    status: 200,
    models: model
}); 


}






