const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/Fetchuser');
const Product = require('../models/Product');

const router = express.Router();

// Get all products
router.get('/getallproduct', fetchUser, async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Add a product
router.post('/addproduct', fetchUser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        let images = req.files.map(el=>{
            return el.filename;
        })
        const { title, description, instock, price } = req.body;
        const product = new Product({
            title,
            description,
            instock,
            price,
            images,
            user: req.user.id
        });
        
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get('/gethomeproduct', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put('/updateproduct/:id', fetchUser, async (req, res) => { 
    const { title, description, price, instock } = req.body; 
    try { 
        const newProduct = {}; 
        if (title) { newProduct.title = title; } 
        if (description) { newProduct.description = description; } 
        if (price) { newProduct.price = price; } 
        if (instock) { newProduct.instock = instock; } 
        let product = await Product.findById(req.params.id); 
        if (!product) { return res.status(404).send('Product not found'); } 
        if (product.user.toString() !== req.user.id) {
             return res.status(403).send('Not allowed');
             } 
        product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true }); 
        res.json(product); 
    } catch (error) { 
        console.error(error); res.status(500).send("Internal server error"); 
    }
     });

router.delete('/deleteproduct/:id',fetchUser , async (req,res)=>{
    try{
        let product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).send("product not found")
        }
        if(product.user.toString()!== req.user.id){
            return res.status(404).send('not allowed')
        }
        product = await Product.findByIdAndDelete(req.params.id)
        res.json({message: "product deleted"})
    }
    catch(error){
        res.status(500).send("internal server error")
    }
})

module.exports = router;
