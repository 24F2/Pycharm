document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('myForm');
    const submitButton = document.getElementById('submit');
    const requiredFields = form.querySelectorAll('[required]');
    const errorMessageDiv = document.getElementById('error-message');

    // Form submission listener for validation and sending data
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        let hasErrors = false;
        errorMessageDiv.textContent = ''; // Clear previous error messages

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                hasErrors = true;
                field.classList.add('error-input');
                // You could add more specific error messages here if needed
            } else {
                field.classList.remove('error-input');
            }
        });

        if (hasErrors) {
            errorMessageDiv.textContent = 'Please fill in all required fields marked with an asterisk (*).';
        } else {
            // If no errors, proceed with sending data to the server
            const formData = new FormData(form);
            const data = {};

            formData.forEach((value, key) => {
                data[key] = value;
            });

            const jsonData = JSON.stringify(data, null, 2);

            fetch('/save-data', { // Replace '/save-data' with your Flask endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            })
            .then(response => response.json()) // Expecting a JSON response from Flask
            .then(data => {
                console.log('Server response:', data);
                if (data.message) {
                    alert(data.message); // Show a success message
                    form.reset(); // Clear the form
                } else if (data.error) {
                    alert(data.error); // Show an error message
                }
            })
            .catch(error => {
                console.error('Error sending data:', error);
                alert('An error occurred while sending data.');
            });
        }
    });

    // Optional: Add real-time validation as the user types
    requiredFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error-input');
            }
        });
    });
});