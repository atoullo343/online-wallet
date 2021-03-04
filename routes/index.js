const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')

// Get home page
router.get('/', (req, res) => {
    res.render('login', {title: 'Login page'})
})

// Get dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { 
        name: req.user.name,
         });
});




module.exports = router;