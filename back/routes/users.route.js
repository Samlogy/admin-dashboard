const router = require('express').Router()
// const sharp = require('sharp');

const User = require('../models/user.model');
const upload = require('../utils/upload_file')

// Functions
const generateUsername = (email) => { //generate username from user's email
    return email.substr(0, email.indexOf('@'))
};
// const resizeImage = (imgInput, height, width, imgOutput, quality) => {
//     sharp(__dirname + `/images/${imgInput}.jpg`).resize(width, height)
//     .jpeg({quality : quality}).toFile(__dirname 
//         + `/images/${imgOutput}.jpg`);
// };

router.post("/uploadfiles", async (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, error: err })
        }
        
        // generate an img 50x50
        // resizeImage(res.req.file.filename, 250, 250, "imgOutput", 50)
        return res.json({ 
            success: true, 
            url: res.req.file.path, 
            fileName: res.req.file.filename 
        })
    })
}); 

router.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).send({
            success: true,
            message: 'Users retieved !',
            data: users
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});
router.get("/filterUsers", async (req, res) => {
    try {
        let queryString = req.query.queryString
        let filterType = req.query.filterType

        if (!queryString) {
            console.log('Plz write something to filter by !')
        } 
        if (!filterType) {
            console.log('Plz select a filter type !')
        } 
        
        let users;
        if (filterType === 'role' || filterType === 'email') {
            const regex = new RegExp(queryString, "i")
            users = await User.find()
                              .where(filterType).equals(regex)

        } else res.status(404).send({
            success: false,
            message: 'wrong filter type set !',
            data: {}
        })

        res.status(201).send({
            success: true,
            message: 'Users retieved !',
            data: users
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});
router.post("/createUser", async (req, res) => {
    try {
        const newUser = new User({ 
            ...req.body,
            username: generateUsername(req.body.email) 
        })
        console.log(newUser)

        const result = await newUser.save()

        res.status(201).send({
            success: true,
            message: 'User Created !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});
router.put("/editUser/:userId", async (req, res) => {
    try {
        let editedUser = req.body
        editedUser.editedAt = new Date()

        const result = await User.findByIdAndUpdate(
                                    req.params.userId, 
                                    editedUser, 
                                    {new: true}
                                    )

        res.status(201).send({
            success: true,
            message: 'User Edited !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});
router.delete("/deleteUser/:userId", async (req, res) => {
    try {
        const result = await User.findByIdAndRemove(req.params.userId)

        res.status(201).send({
            success: true,
            message: 'User Deleted !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});
router.put("/blockUser/:userId", async (req, res) => {
    try {
        let editedUser = req.body
        editedUser.editedAt = new Date()

        const result = await User.findByIdAndUpdate(
                            req.params.userId, 
                            editedUser, 
                            {new: true}
                            )

        res.status(201).send({
            success: true,
            message: result.active ? 'User unBlocked !' : 'User Blocked !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});

module.exports = router