const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    token: {
        type: String,
        required: false
    }
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_TOKEN)

    user.token = token;
    await user.save()

    return token
}

userSchema.statics.userLogin = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Please check credentials.')
    }

    const matchedPassword = await bcrypt.compare(password, user.password)

    if (!matchedPassword) {
        throw new Error('Please check credentials.')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User