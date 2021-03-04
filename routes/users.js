const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')

// Register
router.get('/register', (req, res) => {
    res.render('register', {title: 'Register page'});
});

// router.post('/register', async (req, res) => {
// try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     User.push({
//         id: Date.now().toString(),
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword
//     })
//     res.redirect('/login');
// } catch {
//     res.redirect('/register');
// }
// });





router.post('/register', (req, res) => {
    const {name, email, password} = req.body
    let errors = []

    // forma to'lganini tekshirish
    if(!name || !email || !password){
        errors.push({ msg: 'Iltimos, barcha sohalarni to\'ldiring'})
    }
    // parol validatsiyasi
    if(password.length < 6){
        errors.push({ msg: 'Parol 6 belgidan kam bo\'lmasligi kerak'})
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password
        })
    }else{
        // Validatsiya muvaffaqiyatli bolsa
        User.findOne({ email: email})
        .then( user => {
            if(user) {
                // foydalanuvchi mavjud bolsa
                errors.push({msg: 'Bu email allaqachon ro\'yxatdan o\'tgan'})
               res.render('register', {
                   errors,
                   name,
                   email,
                   password
               })
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
                // hash assword
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err
                        newUser.password = hash
                        newUser
                         .save()
                         .then(user => {
                             req.flash(
                                 'success_msg',
                                 'Ro\'yxatdan o\'tdingiz'
                             )
                             res.redirect('/login')
                         })
                         .catch(err => console.log(err))
                    })
                })
            }
        })
    }
});


// Login page
router.get('/login', (req, res) => {
    res.render('login', {title: 'Login page'})
});

// Login handle
router.post('/login', (req, res, next) => {
passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
})(req, res, next)
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Siz tizimdan muvafaqqiyatli chiqdingiz !')
    res.redirect('/login')
})


module.exports = router