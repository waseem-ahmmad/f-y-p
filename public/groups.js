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
  try {
    const groups = await fetchGroups();
    const allGroupsContainer = document.getElementById("allgroups");
    allGroupsContainer.innerHTML = "";

    const groupboxTemplate = document.getElementById("groupboxTemplate");
     if(!groupboxTemplate)
     {
      console.error("error: groupboxtemplate element not found!");
      return;
     }

    // Sort the groups array based on groupId in descending order to display the latest group at the top
    groups.sort((a, b) => b.groupId - a.groupId);

    
    console.log(groups);

    groups.forEach((group) => {
      const groupBox = groupboxTemplate.content.cloneNode(true).firstElementChild;
      

      // Fill the group info
      groupBox.querySelector(".language").textContent = group.language;
      groupBox.querySelector(".topic").textContent = group.topic;
      groupBox.querySelector(".ownerName").textContent = group.ownerName;

      // Format and display the createdAt date
      const createdAt = new Date(group.createdat);
      groupBox.querySelector(".createdDate").textContent = `Created on: ${createdAt.toLocaleString()}`;

      // Create participants div with maxPeople number of divs
      const participantsDiv = document.createElement("div");
      participantsDiv.classList.add("participants");

      for (let i = 0; i < group.max_people; i++) {
        const participantDiv = document.createElement("div");
        participantDiv.textContent = ""; // You can set the content of each participant div here if needed
        participantsDiv.appendChild(participantDiv);
      }

      groupBox.appendChild(participantsDiv);

      allGroupsContainer.appendChild(groupBox);
    });

    console.log("Groups updated successfully!");
  } catch (error) {
    console.error("Error updating groups:", error);
  }
}

// Function to handle the button click event
const joinTalkButtons = document.querySelectorAll(".jointalk");
joinTalkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Client-side logic to handle join talk button
    console.log("Join talk button clicked");
  });
});

// On page load, fetch groups from the backend and update the groups dynamically
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateGroups, 1000);
});
