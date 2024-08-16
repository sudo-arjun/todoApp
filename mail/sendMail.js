const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: 'Gmail',
    // port: 587,
    auth: {
        user: 'chetanprakash7304@gmail.com',
        pass: 'lvxuquelhnqpbbjx'
    }
});

async function sendMail(email,link) {
    // send mail with defined transport object
    console.log("Wait");
    const info = await transporter.sendMail({
        from: '"chetan" <chetanprakash7304@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Namaste Sekai", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <b>To do application click to confirm</b>
        <a href=${link}>Confirm</a>
        `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
module.exports = sendMail;

// sendMail().catch(console.error);

// const nodemailer = require('nodemailer');



// let mailOptions = {
//     from: '"Your Name" <your-email@gmail.com>', // Sender address
//     to: 'recipient@example.com',               // List of receivers
//     subject: 'Subject',                        // Subject line
//     text: 'Hello world!',                      // Plain text body
//     html: '<b>Hello world!</b>'                // HTML body
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error occurred: ', error);
//     }
//     console.log('Message sent: %s', info.messageId);
// });
