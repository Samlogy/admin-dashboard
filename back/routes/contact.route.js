const router = require('express').Router()

const Contacts = require("../models/contacts.model")

router.get("/", async (req, res) => {
    try {   
        const result = await Contacts.find()
                                        .limit(10)

        res.status(201).send({
            message: "Contacts loaded !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});
// a faire
router.post("/filterByType/:userId", async (req, res) => {
    const { userId } = req.params
    const { type, limit } = req.body

    if (!limit) limit = 5

    try {   
        const result = await Notification.find({ authorId: userId, type: type })
                                        .sort("-createdAt")
                                        .limit(limit)

        res.status(201).send({
            message: `${type} Notifications loaded !`,
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});

router.put("/hide/:contactId", async (req, res) => {
    const { contactId } = req.params
    const { status } = req.body
   
    try {   
        const result = await Contacts.findByIdAndUpdate(contactId, {status: status}, { new: true })

        res.status(201).send({
            message: "Contact hidden !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});

router.put("/check/:contactId", async (req, res) => {
    const { contactId } = req.params
    const { status } = req.body
   
    try {   
        const result = await Contacts.findByIdAndUpdate(contactId, {status: status}, { new: true })

        res.status(201).send({
            message: "Contact checked !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});

router.post("/reply", async (req, res) => {
    const { contactId } = req.params
   
    try {   
        const newContact = new Contacts({ ...req.body })
        const result = await Contacts.save(newContact)

        res.status(201).send({
            message: "Contact replied !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});

module.exports = router