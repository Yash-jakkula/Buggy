const nodemailer = require('nodemailer');

const sendEmail = async(options)=>{
    
    const transporter = nodemailer.createTransport({
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            user:"deee8ec57f72f2",
            pass:"4c1358e18f9208",
        }
    })

    const message = {
        from:`viasdevs <noreplay@visadevs.io>`,
        to:options.to,
        subject:options.subject,
        text:options.message,
    }

   const info =  await transporter.sendMail(message);
   
}

module.exports = sendEmail;