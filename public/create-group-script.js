document.addEventListener("DOMContentLoaded", function () {
  const createGroupForm = document.getElementById("createGroupForm");
  const createGroupBtn = document.getElementById("createGroupBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const params=new URLSearchParams(window.location.search);
  const userId=params.get("id");

  // Handle form submission
  createGroupForm.addEventListener("submit", function (event) {
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
      ownerLevel: ownerLevel,
      ownerId:userId,
    };

    fetch("/create-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("server response data",data.groupData);
      if(data.groupData)
      { alert("group created successfully");
      window.location.href="groups.html";
      }


      
        // // Redirect to group.html with the group data
        // const queryString = `?groupId=${data.groupId}&topic=${data.groupData.topic}&maxPeople=${data.groupData.max_people}&language=${data.groupData.language}&ownerName=${data.groupData.ownerName}&createdAt=${data.groupData.createdat}`;
        // window.location.href = "group.html" + queryString;
      
    })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });


  // Handle cancel button click
  cancelBtn.addEventListener("click", function () {
    // Redirect to previous page
    window.history.back();
  });
});
