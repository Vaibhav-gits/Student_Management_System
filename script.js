const API = "http://localhost:8080/api/students";

function sortStudents(criteria) {
  const tableBody = document.querySelector("#studentTable tbody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  rows.sort((a, b) => {
    const aValue = a.cells[criteria].textContent.toLowerCase();
    const bValue = b.cells[criteria].textContent.toLowerCase();

    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });

  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
}

function searchStudents() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableBody = document.querySelector("#studentTable tbody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let found = false;

    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toLowerCase().includes(searchInput)) {
        found = true;
        break;
      }
    }

    rows[i].style.display = found ? "" : "none";
  }
}

function showLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "block";
  }
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  const container = document.querySelector(".container");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

function loadStudents() {
  showLoading();
  fetch(API)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }
      return res.json();
    })
    .then((data) => {
      const tableBody = document.querySelector("#studentTable tbody");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-muted">No students found</td>
                    </tr>
                `;
        return;
      }

      data.forEach((s) => {
        tableBody.innerHTML += `
                    <tr>
                        <td>${s.id}</td>
                        <td>${s.name}</td>
                        <td>${s.course}</td>
                        <td>${s.age}</td>
                        <td>
                            <button onclick="deleteStudent(${s.id})" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>`;
      });
    })
    .catch((error) => {
      console.error("Error loading students:", error);
      showAlert("Failed to load students. Please try again.", "danger");
    })
    .finally(() => {
      hideLoading();
    });
}

function addStudent(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course").value.trim();
  const age = document.getElementById("age").value.trim();

  if (!name || !course || !age) {
    showAlert("Please fill in all fields", "warning");
    return;
  }

  if (age < 1 || age > 150) {
    showAlert("Please enter a valid age (1-150)", "warning");
    return;
  }

  const student = {
    name: name,
    course: course,
    age: parseInt(age),
  };

  showLoading();
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add student");
      }
      return response.json();
    })
    .then(() => {
      showAlert("Student added successfully!", "success");
      setTimeout(() => {
        window.location = "index.html";
      }, 1500);
    })
    .catch((error) => {
      console.error("Error adding student:", error);
      showAlert("Failed to add student. Please try again.", "danger");
    })
    .finally(() => {
      hideLoading();
    });
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    showLoading();
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete student");
        }
        showAlert("Student deleted successfully!", "success");
        loadStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
        showAlert("Failed to delete student. Please try again.", "danger");
      })
      .finally(() => {
        hideLoading();
      });
  }
}

if (window.location.pathname.includes("index.html")) {
  loadStudents();
}
