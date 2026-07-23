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

transporter.verify((error, success) => {
    if (error) {
        console.error("VERIFY ERROR:", error);
    } else {
        console.log("SMTP Ready");
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

            console.log("Pretending to send email");

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