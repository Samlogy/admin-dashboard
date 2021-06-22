const router = require('express').Router()

const Product = require('../models/products.model');
const upload = require('../utils/upload_file');

// Functions
const resizeImage = (imgInput, height, width, imgOutput, quality) => {
    sharp(__dirname + `/images/${imgInput}.jpg`).resize(width, height)
    .jpeg({quality : quality}).toFile(__dirname 
        + `/images/${imgOutput}.jpg`);
};

router.post("/uploadfiles", async (req, res) => {
    upload(req, res, err => {
        if (err)  return res.json({ success: false, err })
        
        // generate an img 250x250
        resizeImage(res.req.file.filename, 250, 250, "imgOutput", 50)

        return res.json({ 
            success: true, 
            url: res.req.file.path, 
            fileName: res.req.file.filename 
        })
    })
}); 

router.get("/getProducts", async (req, res) => {
    try {
        const result = await Product.find()
        res.status(201).send({
            message: 'Products retieved !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});
router.get("/filterProducts", async (req, res) => {
    try {
        let queryString = req.query.queryString
        let filterType = req.query.filterType

        if (!queryString) {
            console.log('Plz write something to filter by !')
        } 
        if (!filterType) {
            console.log('Plz select a filter type !')
        } 
        
        let products;
        if (filterType === "name") {
            const regex = new RegExp(queryString, "i")
            products = await Product.find()
                                .where(filterType).equals(regex)

        } else res.status(404).send({
            message: 'wrong filter type set !',
            data: {}
        })

        res.status(201).send({
            message: 'Products retieved !',
            data: products
        })
        
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});
router.post("/createProduct", async (req, res) => {
    try {
        const newProduct = new Product({ ...req.body })

        const result = await newProduct.save()

        res.status(201).send({
            message: 'Product Created !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});
router.put("/editProduct/:productId", async (req, res) => {
    try {
        let editedProduct = req.body
        editedProduct.editedAt = new Date()

        const result = await Product.findByIdAndUpdate(
                                    req.params.productId, 
                                    editedProduct, 
                                    {new: true}
                                    )

        res.status(201).send({
            message: 'Product Edited !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});
router.delete("/deleteProduct/:productId", async (req, res) => {
    try {
        const result = await Product.findByIdAndRemove(req.params.productId)

        res.status(201).send({
            message: 'Product Deleted !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});


module.exports = router