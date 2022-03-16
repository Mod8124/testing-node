const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

const handleErrors = err => {
    const errors = {email :"",password:""}

    if(err.code === 11000) {
        errors.email = 'that email is already register';
    }

    if(err.message=== 'incorrect email') {
        errors.email = 'email is incorrect';
    }

    if(err.message === 'incorret password') {
        errors.password = 'password is incorrect';
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
          errors[`${properties.path}`] = `${properties.message}`
        })
     }

     console.log(err.message)
     return errors

}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'secret', {expiresIn: maxAge});
  };
  

const login_get = async (req,res) => {
    res.render('login')
}

const login_post = async (req, res) => {

    const {email, password} = req.body
    try {
        const user = await User.login(email,password)
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({user:user._id, redirect:"/blogs"})
        
    } catch(err) {
       const errors = handleErrors(err)
      res.status(400).json({errors})
    }
   
}

const signup_get = async (req,res) => {
    res.render('signup');
}

const signup_post = async = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.create({email,password});
        // const token = createToken(user._id)
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({user:user._id, location:'/'})

    } catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }

    console.log(email,password)
}

const logout = async (req,res) => {
    res.cookie('jwt', '', {maxAge:1, httpOnly:true})
    res.redirect('/')
}

const tryDos = async (req, res) => {
    res.cookie('buenas', 'tardes')
    res.send('holaaaa')
}

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post,
    logout
}