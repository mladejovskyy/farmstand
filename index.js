const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

    // model variable
const Product = require('./models/product');        

    // connect to database
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("Mongo connection open!");
    })
    .catch(err => {
        console.log("Mongo connection error:");
        console.log(err);
    })

    // app settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

    // app port
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})



const categories = ['fruit', 'vegetable', 'dairy']

    // app new product
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

    // app new product (form submission)
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`)
})

    // app all products
app.get('/products', async (req, res) => {
    const {category} = req.query;
    if(category) {
        const products = await Product.find({category})
        res.render('products/index', {products, category})
    } else {
        const products = await Product.find({})
        res.render('products/index', {products, category: 'All'})
    }
})

    // app single product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

    // app edit product
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

    // app update single product
app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`)
})

    // app delete single product
app.delete('/products/:id', async (req,res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})