const router = require('express').Router()

const Contacts = require("../models/contacts.model")
const User = require("../models/user.model")

router.get("/getContacts", async (req, res) => {
    try { 
        const contacts = await Contacts.find()
                                        .sort("-createdAt")
                                        .limit(10)
        const requests = contacts.map(contact => 
                User.findById(contact.authorId)
                .then(user => {
                    // create fn to format data
                    let data = {...user['_doc']}

                    // change key attributes
                    data.userCreatedAt = data.createdAt
                    data.user__v = data.__v

                    // delete previous fields
                    delete data['createdAt']; 
                    delete data['__v']; 
                    delete data['_id'];
                    
                    // merge commentData + userData
                    data = {...data, ...contact['_doc']}
                    return data
                })
                .catch(err => res.status(500).send({ error: err.message }))
            )
            const result = await Promise.all(requests)

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
    const newContact = req.body
   
    try {   
        const result = await Contacts.create(newContact)

        res.status(201).send({
            message: "Contact replied !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }        
});

module.exports = router