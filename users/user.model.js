const con= require("./../_helpers/db");
const { body } = require('express-validator');
const util = require('util');


let table='users';

const query = util.promisify(con.query).bind(con);


module.exports={

    findByEmail,
    create,
    validate,
    findById,
    getList
}




async function validate(method){

    switch (method) {
        case 'createUser': {
         return [ 
            body('password').exists(),
            body('email').exists().isEmail(),
            
           ];   
        }
      }
    
}




async function create(obj){


    let email=obj.email;
    let password=obj.password;
    let first_name=obj.first_name;
    let last_name=obj.last_name;
    let organization_name=obj.organization_name;

    let sql = `INSERT INTO ${table} (email, password,first_name,last_name) VALUES ('${email}', '${password}','${first_name}','${last_name}')`;
    console.log(sql);
    let model =await query(sql);
    console.log(model);

    let inserted_id=model.insertId;

    let sql1 = `INSERT INTO emloyees (user_id, organization_name) VALUES ('${inserted_id}', '${organization_name}')`;
    await query(sql1);
    return model;
}

async function findByEmail(email){

    let sql=`SELECT * FROM ${table} where email='${email}'`;


     try{


      let model =await query(sql);

      console.log("findByEmail try",model);
      return model;


     }catch(err){

        console.log("findByEmail",err);
     }

}

async function findById(id){

    let sql=`SELECT * FROM ${table} where id='${id}'`;


     try{


      let model =await query(sql);

      console.log("findByEmail try",model);

      if(model.length==0){
          return null;
      }
      return model[0];


     }catch(err){

        console.log("findByEmail",err);
     }

}

async function getList(body){
         
    let sql=`SELECT * FROM ${table} LEFT JOIN emloyees on users.id=emloyees.user_id where users.id > 0`;
   
    if(body.hasOwnProperty('first_name') && body.first_name!=''){

         sql+=` AND users.first_name="${body.first_name}"`;
    }

    if(body.hasOwnProperty('last_name') && body.last_name!=''){

        sql+=` AND users.last_name="${body.last_name}"`;
   }
   if(body.hasOwnProperty('email') && body.email!=''){
         sql+=` AND users.email="${body.email}"`;
    }
    if(body.hasOwnProperty('organization_name') && body.organization_name!=''){
        sql+=` AND emloyees.organization_name="${body.organization_name}"`;
   }
   
    console.log(sql);
    let model =await query(sql);
    
    return model;


}