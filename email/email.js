const sgMail = require('@sendgrid/mail')


sgMail.setApiKey('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')

const workdone =(email,worktitle,assigned_to)=>{

  sgMail.send({
    to:email,
    from:'riteshsingh861@gmail.com',
    subject:`${assigned_to} completed some work`,
      text:`Hi , ${assigned_to} has completed the task : ${worktitle}.`
  })
}

module.exports={
  workdone
}
