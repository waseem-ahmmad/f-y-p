document.addEventListener("DOMContentLoaded", function() {
    const profileToggle = document.querySelector(".profile-toggle");
  const profileDropdown = document.querySelector(".profile-dropdown");
  
  profileToggle.addEventListener("click", function() {
    profileDropdown.classList.toggle("show");
  });
  
  
    const createGroupBtn = document.querySelector(".create-group");
  
    createGroupBtn.addEventListener("click", function() {
      // Redirect to creategroup.html
      window.location.href = "creategroup.html";
    });
  });
  