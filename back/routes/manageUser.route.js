const router = require('express').Router()

const User = require('../models/user.model');

/* Manage User */
router.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).send({
            message: 'Users retieved !',
            data: users
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
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
            message: 'wrong filter type set !',
            data: {}
        })

        res.status(201).send({
            message: 'Users retieved !',
            data: users
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
    }
});
router.post("/createUser", async (req, res) => {
    try {
        const newUser = new User({ ...req.body })

        const result = await newUser.save()

        res.status(201).send({
            message: 'User Created !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
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
            message: 'User Edited !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
    }
});
router.delete("/deleteUser/:userId", async (req, res) => {
    try {
        const result = await User.findByIdAndRemove(req.params.userId)

        res.status(201).send({
            message: 'User Deleted !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
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
            message: result.active ? 'User unBlocked !' : 'User Blocked !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
    }
});


module.exports = router