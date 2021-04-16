const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const io =require('server');
const multer = require('multer')
const { body, validationResult } = require('express-validator');

var storage = multer.diskStorage({ 
       destination: (req, file, cb) => { 
           //console.log('image upload func',file)
      cb(null, './uploads')
        },
     filename: (req, file, cb) => {
         console.log('file rename',file)
      cb(null, file.originalname)
           }
   });
 var upload = multer({storage: storage});
 var user=require("./user.model");
// routes
router.post('/login', body('email').isEmail().exists(),
body('password').exists(),login);
router.post('/register',body('email').isEmail(),
body('password').exists(),
body('first_name').exists(),
body('last_name').exists(),
upload.single('image_file'),
register);

router.post('/list',list);



module.exports = router;


async function login(req,res){
await userService.Login(req,res);

}



async function register(req,res){

    await userService.register(req,res);
    
    }


    async function list(req,res){

        await userService.getList(req,res);
        
    }