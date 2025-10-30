document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("zN1n1yHaFHmkIb6vv");

    const form = document.getElementById('reservationForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        emailjs.sendForm('service_jb8f39r', 'template_9929xoi', this)
        .then(function() {
            // Dodaj animację fadeOut
            form.classList.add('animate__animated', 'animate__fadeOut');

            // Po zakończeniu animacji
            form.addEventListener('animationend', function() {
                form.style.display = 'none';

                const message = document.createElement('div');
                message.className = 'text-center p-5 bg-white shadow rounded animate__animated animate__fadeIn';
                message.innerHTML = '<h3>Dziękujemy!<br>Skontaktujemy się z Tobą wkrótce.</h3>';

                form.parentNode.appendChild(message);
            }, { once: true }); // listener wykona się tylko raz
        }, function(error) {
            alert('❌ Wystąpił błąd. Spróbuj ponownie. ' + JSON.stringify(error));
        });
    });
});
