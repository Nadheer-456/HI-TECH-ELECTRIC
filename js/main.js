document.addEventListener('DOMContentLoaded', () => {
    // 1. AOS Animation Initialization
    AOS.init({ duration: 1000, once: true });

    // 2. Sticky Header Logic
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('shadow-sm');
        } else {
            document.querySelector('.navbar').classList.remove('shadow-sm');
        }
    });

    // 3. Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    // 4. Form Validation
        const contactForm = document.getElementById("contactForm");

        if (contactForm) {

            contactForm.addEventListener("submit", async function (e) {

                e.preventDefault();
                
                const fullName = document.getElementById("fullName").value;
                const phone = document.getElementById("phone").value;
                const message = document.getElementById("message").value;
                const service=document.getElementById("service").value;
                const submitButton = document.querySelector(".btn-submit");

                submitButton.disabled = true;
                submitButton.innerHTML = "Sending...";

                Swal.fire({
                        title: "Sending your booking...",
                        text: "Please wait a moment.",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

            try {

            const response = await fetch("https://hi-tech-electric.onrender.com/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        phone,
                        service,
                        message
                    })
                });

                const text = await response.text();

                console.log(text);

                Swal.close();

                if (response.ok) {

                    Swal.fire({
                        icon: "success",
                        title: "Booking Confirmed!",
                        text: "Your booking has been received."
                    });

                    contactForm.reset();

                } else {

                    Swal.fire({
                        icon: "error",
                        title: "Booking Failed",
                        text: text
                    });

                }

            } catch (err) {

                Swal.close();

                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Network Error",
                    text: err.message
                });

            }

            submitButton.disabled = false;
            submitButton.innerHTML = "Submit Request";

            });

        }
});
