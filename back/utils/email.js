const mailer = require("nodemailer")

const { Template } = require("./template")

const generateEmail = (entries, template) => {
    let data = null;
    const { from, to, subject, attachment } = entries

    switch (template) {
        case "register":
            data = {
                from: `${from} <jaewon@gmail.com>`,
                to,
                subject: subject || `Hello `,
                html: Template(entries)
            }
            break;
        default:
            data;
    }
    return data;
}

const sendEmail = (data, type) => {

    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })
    
    const mail = generateEmail(data, type)
    
    smtpTransport.sendMail(mail, function(err, res) {
        if (err) console.log(err)
        else console.log("email sent successfully")
 
        smtpTransport.close()
    })
}

module.exports = { sendEmail }