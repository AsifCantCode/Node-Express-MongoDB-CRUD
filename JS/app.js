const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    resetForm();
    fetchAndDisplay();
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        findStudent();
    });
});

//Function to delete a row
function deleteRow(button){
    const row = button.closest('tr');
    const studentId = row.cells[1].textContent;
    deleteRowBackend(studentId);
    row.remove();
}


//Function to save a student
function saveStudent(){
    const name = document.getElementById('name').value;
    const SID = document.getElementById('studentId').value;
    const university = document.getElementById('university').value;

    fetch(url + '/api/students', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, SID, university}),
    })
    .then(response => response.json())
    .then(data => {
        alert('Student Saved Successfully!');
        console.log('Student: ', data)
    })
    .catch(error => {
        console.error('Error saving student:', error);
        alert('Error saving student. Please try again.');
    })
    updateStudent(SID);
    resetForm();
    fetchAndDisplay();
}

//Fetch all and Display in Table
function fetchAndDisplay(){
    const tableBody = document.getElementById('infoTableBody');
    tableBody.innerHTML = '';
    console.log('Fetching data from:', url + '/api/students');
    fetch(url+'/api/students')
    .then(response => response.json())
    .then(students => {
        students.forEach(student => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${student.name}</td>
                                <td>${student.SID}</td>
                                <td>${student.university}</td>
                                <td><button type="button" class="btn btn-danger" onclick="deleteRow(this, '${student._id}')">Delete</button></td>`;
            tableBody.appendChild(newRow);
        });
    })
    .catch(error => {
        console.error('Error fetching students:', error);
    });
}


//Delete from the backend as well
function deleteRowBackend(studentId){
    fetch(url + '/api/students/'+studentId, {
        method: 'DELETE',
    })
    .then(response => {
        if(response.ok){
            console.log('SUCCESS!');
            fetchAndDisplay();
        }else{
            console.error('Error!');
        }
    })
    .catch(error => {
        console.error('Error deleting student:', error);
    });
}

//Reset form inputs
function resetForm() {
    const form = document.getElementById('studentForm');
    const searchQuery = document.getElementById('searchInput');
    searchQuery.value = '';
    form.reset();
}

//Find students by searching
function findStudent() {
    try {
        const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();

        // Use the consistent query parameter name
        fetch(`${url}/api/students/find?name=${searchQuery}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching data');
                }
            })
            .then(data => {
                fetchAndDisplayPartial(data);
            })
            .catch(error => {
                console.error('Error:', error.message);
            })
            .finally(() => {
                // Clear the search input value
                //searchInput.value = '';
            });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function fetchAndDisplayPartial(data) {
    const tableBody = document.getElementById('infoTableBody');
    tableBody.innerHTML = '';
    data.forEach(student => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${student.name}</td>
                            <td>${student.SID}</td>
                            <td>${student.university}</td>
                            <td><button type="button" class="btn btn-danger" onclick="deleteRow(this, '${student._id}')">Delete</button></td>`;
        tableBody.appendChild(newRow);
    });
}

//Update Function Pls
function updateStudent(studentId){
    fetch(url + '/api/students/update/'+studentId, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({studentId}),
    })
    .then(response => response.json())
    .then(data => {
        alert('Student Saved Successfully!');
        console.log('Student: ', data)
    })
    .catch(error => {
        console.error('Error saving student:', error);
        alert('Error saving student. Please try again.');
    })
}