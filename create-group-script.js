document.addEventListener("DOMContentLoaded", function() {
    const createGroupForm = document.getElementById("createGroupForm");
    const createGroupBtn = document.getElementById("createGroupBtn");
    const cancelBtn = document.getElementById("cancelBtn");
  
    // Handle form submission
    createGroupForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Get form field values
      const topic = document.getElementById("topic").value.trim();
      const maxPeople = document.getElementById("maxPeople").value;
      const language = document.getElementById("language").value;
      const ownerLevel = document.getElementById("level").value.trim();
  
      // Perform necessary validations
      if (!topic || !maxPeople || !language || !level) {
        alert("Please fill in all fields.");
        return;
      }
        // Send the data to the server using a POST request
    const data = {
        topic: topic,
        maxPeople: maxPeople,
        language: language,
        ownerLevel: ownerLevel
      };
  
      fetch("/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          // Redirect to groups.html or perform other actions upon successful group creation
          window.location.href = "groups.html";
        } else {
          alert("Failed to create group. Please try again later.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
    });
  
  
      // Redirect to groups.html or perform other actions
      window.location.href = "groups.html";
    });
  
    // Handle cancel button click
    cancelBtn.addEventListener("click", function() {
      // Redirect to previous page
      window.history.back();
    });
  });
  