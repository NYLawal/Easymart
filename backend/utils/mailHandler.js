const nodemailer = require("nodemailer");


const sendEmail = async (email, subject, text) => {
    // try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        debug: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.USER_PASSWORD,
        },
        from: process.env.EMAIL_USER,
      });
  
      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          text: text
                },
                (error, info) => {
                  if (error) {
                    console.error("Error sending email:", error);
                  } else {
                    console.log("Email sent successfully:", info.response);
                  }
                }
              );
            // } catch (error) {
            //   console.log(error, "email not sent");
            // }
          };
          
        module.exports = sendEmail;

