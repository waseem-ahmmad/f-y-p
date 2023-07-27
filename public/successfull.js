document.addEventListener("DOMContentLoaded",function(){


    // Get query parameters from URL
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");
  const userName = params.get("name");
  const userEmail = params.get("email");
  const userCreatedAt = params.get("createdAt");

  // Fill the user data on successfull.html
  document.getElementById("userId").textContent = userId;
  document.getElementById("userName").textContent = userName;
  document.getElementById("userEmail").textContent = userEmail;
  document.getElementById("userCreatedAt").textContent = userCreatedAt;
    
    const profileToggle = document.querySelector(".profile-toggle");
    const profileDropdown = document.querySelector(".profile-dropdown");
    
    profileToggle.addEventListener("click", function() {
      profileDropdown.classList.toggle("show");
    });
    
    
      const createGroupBtn = document.querySelector(".create-group");
    
      createGroupBtn.addEventListener("click", function() {
        // Redirect to creategroup.html
        window.location.href = `creategroup.html?id=${userId}`;
      });





});
