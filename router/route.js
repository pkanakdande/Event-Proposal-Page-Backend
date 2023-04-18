const express=require('express');
const bcrypt=require("bcrypt");

const registerModel=require("../Schema/registerschema.js");
const registerUserModel = require('../Schema/userSchema/registeruser.js');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}))
router.get("/",(req,res)=>{
    res.send("Hello World")
})
router.post("/register",async (req,res)=>{
    try
    {
        // console.log(req.body);
        let {name,email,phone,password,confirm_password}=req.body;
        if(password===confirm_password)
        {
            let password=await bcrypt.hash(password,10)
            console.log(password);
            let registerDoc=await new registerModel({
               name:name,
               email:email,
               phone:phone,
               password:password
            })
            await registerDoc.save();
            res.send("successful")
        }
        else
        {
            res.send("password is not matching")
        }
    }
    catch (error)
    {
        res.send(error)
    }
})
router.post("/login",async (req,res)=>{
    try
    {
        let {email,password}=req.body;
        let data=await registerModel.findOne({email:email})
        if(data)
        {
            let match=await bcrypt.compare(password,data.password)
            if(match)
            {
                const token=await jwt.sign({email:req.body.email},"secret_key")
                console.log(token)
                res.send("login successful")

            }
            else
            {
                res.send("worong password")
            }
        }
        else
        {
            res.send("not registered")
        }
    }
    catch (error)
    {
        res.send(error)
    }
})



router.post("user/register",async (req,res)=>{
    try
    {
        // console.log(req.body);
        let {name,email,phone,password,confirm_password}=req.body;
        if(password===confirm_password)
        {
            let password=await bcrypt.hash(password,10)
            console.log(password);
            let createUser=await new registerUserModel({
               name:name,
               email:email,
               phone:phone,
               password:password
            })
            await createUser.save();
            res.send("successful")
        }
        else
        {
            res.send("password is not matching")
        }
    }
    catch (error)
    {
        res.send(error)
    }
})










module.exports=router