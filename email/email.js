const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_KEY)

const workdone = (email, worktitle, assigned_to) => {

    sgMail.send({
        to: email,
        from: 'mahateymanvika@gmail.com',
        subject: `${assigned_to} completed some work`,
        text: `Hi , ${assigned_to} has completed the task : ${worktitle}.`
    })
}

module.exports = {
    workdone
}
