
document.addEventListener("DOMContentLoaded",function(event){
event.preventDefault();


console.log("dom content loaded ");
document.getElementById("continuesignup").addEventListener("click",(event)=>{

event.preventDefault();
  //get form values
  const name=document.getElementById("name").value;
  const phone=document.getElementById("phone").value;
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  console.log("form values obtained");
  //create payload object 
  const userData={
    name:name,
    phone:phone,
    email:email,
    password:password,
  };

     console.log("payload created as");
     console.log(userData);
     

      //send data to backend using fetch
      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("user data recieved from server",data);
           // Fill the user data on successfull.html
           
           
           window.location.href= "successfull.html?id=" + data.Id + "&name=" + data.name + "&email=" + data.email + "&createdAt=" + data.createdAt;
          });
        
         
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  


  