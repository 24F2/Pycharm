document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#data-table tbody');
    const addDataForm = document.getElementById('add-data-form');

    // Fetch and display data
    function fetchData() {
        fetch('/view-data')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Clear existing table rows
                tableBody.innerHTML = '';

                // Populate the table with data
                data.data.forEach((entry, index) => {
                    const row = document.createElement('tr');

                    const timeCell = document.createElement('td');
                    timeCell.textContent = entry.time;
                    row.appendChild(timeCell);

                    const firstNameCell = document.createElement('td');
                    firstNameCell.textContent = entry.user_data.first_name;
                    row.appendChild(firstNameCell);

                    const lastNameCell = document.createElement('td');
                    lastNameCell.textContent = entry.user_data.last_name;
                    row.appendChild(lastNameCell);

                    const emailCell = document.createElement('td');
                    emailCell.textContent = entry.user_data.email;
                    row.appendChild(emailCell);

                    const messageCell = document.createElement('td');
                    messageCell.textContent = entry.user_data.message;
                    row.appendChild(messageCell);

                    const actionsCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteData(index));
                    actionsCell.appendChild(deleteButton);
                    row.appendChild(actionsCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('An error occurred while fetching data.');
            });
    }

    // Add new data
    addDataForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(addDataForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    addDataForm.reset();
                    fetchData();
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error adding data:', error);
                alert('An error occurred while adding data.');
            });
    });

    // Delete data
    function deleteData(index) {
        fetch('/delete-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    fetchData();
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                alert('An error occurred while deleting data.');
            });
    }

    // Initial fetch
    fetchData();
});