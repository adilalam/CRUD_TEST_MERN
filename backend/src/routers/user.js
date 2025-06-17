const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users/register', async (req, res) => {
    const {email, password} = req.body;

    console.log('req.body ', req.body)

    if(!email) {
       return res.status(400).send("Email is required");
    }

    if(!password) {
       return res.status(400).send("Password is required");
    }

    if(password.length < 8) {
       return res.status(400).send("Password is max 8 character");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const user = new User(req.body);

    try {
        await user.save()
        res.status(201).send({ user, message: 'Register is successfull.' })
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

router.post('/users/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email) {
       return res.status(400).send("Email is required");
    }

    if(!password) {
       return res.status(400).send("Password is required");
    }

    if(password.length < 8) {
       return res.status(400).send("Password is max 8 character");
    }

    try {
        const user = await User.userLogin(email, password)
        const token = await user.generateToken()
        res.send({ user, token, message: 'Login success.' })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save()

        res.send({message: 'Logout successfull.'})
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router