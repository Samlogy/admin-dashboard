const router = require('express').Router()

const Subscribe = require('../models/subscribe.model')
const NewsLetterTrace = require('../models/newsLetterTrace.model')

const { sendEmail } = require('../utils/email')

/* Newsletter */                
router.post("/writeNewsletter", async (req, res) => {
    try {
        const { newsletterData, files, authorID } = req.body

        // get subscribers
        const subscribers = await Subscribe.find()

        if (subscribers.length === 0) {
            res.status(500).send("an Error occured !")
            return;
        }

        // save newsletter trace in DB
        const messageTrace = new NewsLetterTrace({ 
            email: subscribers.map(el => el.email),
            ...newsletterData,
            authorId: authorID
        })
        const result = await messageTrace.save() 
        
        // send Email
    //     const data = {
    //     to: `...subscribers`,
    //     subject: newsletterData.subject, 
    //     text: newsletterData.message, 
    //     attachment: [{}]
    //   }

    //   sendEmail(data, "register")

        res.status(201).send({
            message: 'Newsletter sent !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ error: err })
    }
});

module.exports = router