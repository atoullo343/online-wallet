const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const { ensureAuthenticated } = require('../config/auth')


// Create product
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create', {
         name: req.user.name
    });
})
router.post('/create', ensureAuthenticated, async (req, res) => {

    const { title, price } = req.body
    let errors = []
    if (!title || !price) {
       errors.push({msg: 'Iltimos, barcha soxalarni to\'ldiring !'})
    }
   if(errors.length > 0){
       res.render('create', {errors, title, price})
   }
    let product = new Product({
       title,
        price 
    });
    product = await product.save();
    res.redirect('/expenses/getAll');
});


// Get all product 
router.get('/getAll', ensureAuthenticated, async (req, res) => {
    let products = await Product.find().lean()
    
    res.render('getAll', { products });
});

// show edit page
router.get('/edit/:id', async (req, res) => {
    
      const product =await Product.findOne({ _id: req.params.id}).lean()
      if(!product){
          res.render('getAll')
      }else{
          res.render('edit', {
              product
          })
      }
    
})


// Update product
router.post('/:id', async (req,res) => {
    try {
        let product = await Product.findById(req.params.id).lean()
        
        if(!product){
            return res.render('error/404')
        }else{
            product = await Product.findByIdAndUpdate({ _id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('getAll')
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// Delete product

router.get('/delete/:id', (req, res) => {
  Product.findByIdAndRemove((req.params.id), (err, doc) =>{
      if(!err){
          res.redirect('/expenses/getAll')
      }else{
          console.log('Malumotni ochirishdagi xato: ' + err)
      }
  })
})

module.exports = router