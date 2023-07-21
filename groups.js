// Function to fetch groups from the backend
async function fetchGroups() {
    try {
      const response = await fetch("/get-groups");
      const data = await response.json();
      return data.groups;
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  }
  
  // Function to dynamically update the groups in the allgroups div
  async function updateGroups() {
    const groups = await fetchGroups();
    const allGroupsContainer = document.getElementById("allgroups");
    allGroupsContainer.innerHTML = "";
  
    const groupboxTemplate = document.getElementById("groupboxTemplate");
  
    groups.forEach((group) => {
      const groupBox = groupboxTemplate.content.cloneNode(true).firstElementChild;
  
      // Fill the group info
      groupBox.querySelector(".language").textContent = group.language;
      groupBox.querySelector(".topic").textContent = group.topic;
      groupBox.querySelector(".ownerName").textContent = group.ownerName;
  
      // Format and display the createdAt date
      const createdAt = new Date(group.createdAt);
      groupBox.querySelector(".createdDate").textContent = `Created on: ${createdAt.toLocaleString()}`;
  
      // Create participants div with maxPeople number of divs
      const participantsDiv = document.createElement("div");
      participantsDiv.classList.add("participants");
  
      for (let i = 0; i < group.maxPeople; i++) {
        const participantDiv = document.createElement("div");
        participantDiv.textContent = ""; // You can set the content of each participant div here if needed
        participantsDiv.appendChild(participantDiv);
      }
  
      groupBox.appendChild(participantsDiv);
  
      allGroupsContainer.appendChild(groupBox);
    });
  }
  
  // Function to handle the button click event
  document.getElementById("jointalk").addEventListener("click", () => {
    // Add your logic here for what should happen when the "Join Talk" button is clicked
    console.log("Join Talk button clicked");
  });
  
  // On page load, fetch groups from the backend and update the groups dynamically
  document.addEventListener("DOMContentLoaded", () => {
    updateGroups();
  });
  