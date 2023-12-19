const User = require('../models/user.model')
const bcrypt = require('bcrypt')

const getAllUsers = async(req,res)=>{
    try {
        const users = await User.findAll({where: req.query})
        if(users){
            return res.status(200).json(users)
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const getOneUser = async(req,res)=>{
    try {
        const user = await User.findByPk(req.params.userId)
        if(user){
            return res.status(200).json(user)
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const getOwnProfile = async(req,res)=>{
    try {
        const user = await User.findByPk(res.locals.user.id,{
            attributes : {
                exclude : ["password"]
            }
        })
        if(user){
            return res.status(200).json(user)
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}


const createUser = async(req,res)=>{
    try {
        const { username, email, password, role } = req.body

        if (password.length < 8){
            return res.status(400).json({ message: 'Password too short' })
        }

        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS))
        const encrypted = bcrypt.hashSync(password, salt)

        const user = await User.create({
            email: email,
            password: encrypted,
            username: username,
            role: role
        })

        if(user){
            return res.status(200).json(user)
        }else{
            return res.status(404).send("User not created")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const updateUser = async(req,res)=>{
    try {
        const user = await User.update(req.body,{
            where : {
                id : req.params.userId
            }
        })
        if(user){
            return res.status(200).json({message : "user updated"})
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const updatePassword = async(req,res)=>{
    try {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS))
        const encrypted = bcrypt.hashSync(req.body.password, salt)
        req.body.password = encrypted
        const user = await User.update(req.body,{
            where : {
                id : res.locals.user.id
            }
        })
        if(user){
            return res.status(200).json({message : "password updated"})
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const updateOwnProfile = async(req,res)=>{
    try {
        const user = await User.update(req.body,{
            where : {
                id : res.locals.user.id
            }
        })
        if(user){
            return res.status(200).json({message : "user updated"})
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const deleteUser = async(req,res)=>{
    try {
        const user = await User.destroy({
            where : {
                id : req.params.userId
            }
        })
        if(user){
            return res.status(200).json({message : "user deleted"})
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}
const deleteProfile = async(req,res)=>{
    try {
        const user = await User.destroy({
            where : {
                id : res.locals.user.id
            }
        })
        if(user){
            return res.status(200).json({message : "user deleted"})
        }else{
            return res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}


module.exports = {
    getAllUsers,
    getOneUser,
    getOwnProfile,
    createUser,
    updateUser,
    updatePassword,
    updateOwnProfile,
    deleteUser,
    deleteProfile
}