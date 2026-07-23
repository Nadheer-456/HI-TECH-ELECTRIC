const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://hi-tech-electric-henna.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test Route
app.get("/", (req, res) => {
    res.json({
        status: "Backend is working 🚀"
    });
});

// Contact Route
app.post("/contact", async (req, res) => {

    const { fullName, phone, service, message } = req.body;

    // Validation
    if (!fullName || !phone || !service || !message) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    console.log("📩 New Booking:");
    console.log(req.body);

    try {

        const response = await resend.emails.send({

            from: "HI-TECH ELECTRIC <onboarding@resend.dev>",

            to: process.env.RECEIVER_EMAIL,

            subject: "🔌 New Electrical Service Booking",

            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.7; max-width:600px; margin:auto;">

                    <h2 style="color:#0056D2;">
                        🔌 New Electrical Service Booking
                    </h2>

                    <hr>

                    <p><strong>👤 Customer Name:</strong> ${fullName}</p>

                    <p><strong>📞 Phone Number:</strong> ${phone}</p>

                    <p><strong>🛠️ Service Required:</strong> ${service}</p>

                    <p><strong>📝 Customer Message:</strong></p>

                    <div style="
                        background:#f8f9fa;
                        padding:15px;
                        border-left:4px solid #0056D2;
                        border-radius:6px;
                        white-space:pre-wrap;
                    ">
                        ${message}
                    </div>

                    <br>

                    <p style="color:#666;font-size:14px;">
                        This booking was submitted from the HI-TECH ELECTRIC website.
                    </p>

                </div>
            `

        });

        console.log("✅ Email Sent Successfully");
        console.log(response);

        return res.status(200).json({
            message: "Booking sent successfully!"
        });

    } catch (error) {

        console.error("❌ Email Error:");
        console.error(error);

        return res.status(500).json({
            message: "Unable to send email."
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});