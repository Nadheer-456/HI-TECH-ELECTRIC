const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

const PORT = process.env.PORT || 5000;


app.post("/contact", async (req, res) => {

    const { fullName, phone, service, message } = req.body;

    if (!fullName || !phone || !service || !message) {
    return res.status(400).json({
        message: "All fields are required."
    });
}

    console.log(req.body);


    try {
        await transporter.sendMail({

            from: '"HI-TECH ELECTRIC" <hitechelectrician1@gmail.com>',

            to: "hitechelectrician1@gmail.com",

            subject: "New Electrician Booking",

            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.7;">

                    <h2 style="color:#0056D2;">
                        🔌 New Electrical Service Booking
                    </h2>

                    <hr>

                    <p><strong>👤 Customer Name:</strong> ${fullName}</p>

                    <p><strong>📞 Phone Number:</strong> ${phone}</p>

                    <p><strong>🛠️ Service Required:</strong> ${service}</p>

                    <p><strong> 📝 Customer Message:</strong></p>

                    <div style="
                        background:#f8f9fa;
                        padding:15px;
                        border-left:4px solid #0056D2;
                        border-radius:6px;
                    ">
                        ${message}
                    </div>

                </div>
            `

        });

        res.json({
            message: "Booking sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to send email."
        });

    }

});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});