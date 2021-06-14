const router = require('express').Router()

const Notification = require("../models/notifications.model")

router.get("/:userId", async (req, res) => {
    const { userId } = req.params

    try {   
        const result = await Notification.find()
                                        .where('authorId').equals(userId)
                                        .sort('-createdAt')
                                        .limit(10)

        res.status(201).send({
            message: "Notifications loaded !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err })
    }        
});

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
        res.status(500).send({ error: err })
    }        
});

router.put("/hide/:notificationId/:status", async (req, res) => {
    const { notificationId, status } = req.params
    // const { status } = req.body
   
    try {   
        const result = await Notification.findByIdAndUpdate(notificationId, {status: status}, { new: true })

        res.status(201).send({
            message: "Notification hidden !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err })
    }        
});

router.delete("/delete/:notificationId", async (req, res) => {
    const { notificationId } = req.params

    try {   
        const result = await Notification.findByIdAndRemove(notificationId)

        res.status(201).send({
            message: "Notification deleted !",
            data: result
        })

    } catch (err) {
        res.status(500).send({ error: err })
    }        
});

module.exports = router