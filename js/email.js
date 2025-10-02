
document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("HBSYfBM8UZMwYbkCO");

    const form = document.getElementById('reservationForm');
    if (!form) return;

    // Obsługa wysyłki formularza
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        emailjs.sendForm('service_a55dca4', 'template_kb8gxtc', this)
        .then(function() {
            alert('Twoje zapytanie zostało wysłane! Spodziewaj się odpowiedzi wkrótce.');
            form.reset();
        }, function(error) {
            alert('❌ Wystąpił błąd. Spróbuj ponownie. ' + JSON.stringify(error));
        });
    });
});
