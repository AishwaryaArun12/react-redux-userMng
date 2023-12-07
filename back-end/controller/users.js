const User = require('../model/user');
const jwt = require('jsonwebtoken');
const jwtSecret = 'secretKey1234';

module.exports  = {
    register : async(req,res)=>{
       try {
         const user = await User.find({email : req.body.email})
         if(user.length > 0){
            res.status(500).json({error : 'You already registered, Please login..'})
         }else{
            const newUser = new User(req.body);
            newUser.save();
            res.status(200).json({message : 'Success'})
         }
       } catch (error) {
        console.log(error.message);
       }
    },
    login : async(req,res)=>{
        
        try {
            let user = null;
            if(req.body.login){
                 user = await User.findOne({email: req.body.email});
            }else{
                 user = await User.findOne({email: req.body.email,password : req.body.password});
            }
            if(user){
                const token = jwt.sign({ email : req.body.email }, jwtSecret, { expiresIn: '1h' });
               req.body.email == 'aishwarya4arun@gmail.com' ? res.status(200).json({token,user,admin : true}) :  res.status(200).json({token,user,admin : false});
            }else{
                res.status(401).json({error : 'invalid credential'})
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    getUsers : async(req,res)=>{
        try {
            let users = await User.find();
            res.json({users})
        } catch (error) {
            console.log(error)
        }
    },
    blockUser : async(req,res)=>{
        try {
            const id = req.params.id;
           await User.findByIdAndUpdate(id,{active: false})
           res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error);
        }
    },
    activeUser : async(req,res)=>{
        try {
            const id = req.params.id;
            await User.findByIdAndUpdate(id,{active: true})
            res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error)
        }
    },
    editEmail : async (req,res)=>{
        try {
            const {oldEmail,newEmail} = req.body;
            await User.findOneAndUpdate({email : oldEmail},{email : newEmail});
            res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error);
        }
    },
    editPassword : async (req,res)=>{
        try {
            const {email,newPassword} = req.body;
            await User.findOneAndUpdate({email},{password : newPassword});
            res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error);
        }
    },
    editProfile : async (req,res)=>{
        try {
            const {email,name,mobile,designation,address} = req.body;
            await User.findOneAndUpdate({email},{name,mobile,designation,address});
            res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error);
        }
    },
    editProfilePic : async(req,res)=>{
        try {
            const {email} = req.body;
            const filename = `img/${req.file.filename}`
           const result = await User.findOneAndUpdate({email},{image : filename});
           console.log(result,req.file,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            res.status(200).json({data : 'ok'})
        } catch (error) {
            console.log(error);
        }
    }

}

