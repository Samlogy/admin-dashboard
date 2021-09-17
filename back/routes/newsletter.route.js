const router = require('express').Router()

const Subscribe = require('../models/subscribe.model')
const NewsLetterTrace = require('../models/newsLetterTrace.model')

const { sendEmail } = require('../utils/email')
const upload = require('../utils/upload_file')

/* Newsletter */  
router.post("/uploadfiles", async (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, error: err })
        }
        return res.json({ 
                        success: true, 
                        url: res.req.file.path, 
                        fileName: res.req.file.filename 
                    })
    })
});             
router.post("/write", async (req, res) => {
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
            success: true,
            message: 'Newsletter sent !',
            data: result
        })
        
    } catch (err) {
        res.status(500).send({ success: false, error: err.message })
    }
});

module.exports = router