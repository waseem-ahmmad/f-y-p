

document.addEventListener("DOMContentLoaded",function(){

document.getElementById("continuesignin").addEventListener("click",function(event){
event.preventDefault();

//get form values 
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;
//perform necessary client side validation 
if(!email || !password)
{
    alert("please fill in both email and password fields.");
    return;
}
//create payload object
const loginData={
    email:email,
    password:password,
};
fetch("/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(loginData),
})
.then((response)=>{
    if(response.ok){
        //if response status is ok redirect to successfull.html
        return response.json();
    }
    else if(response.status===404)
    {
        alert("user not found please create an account first");
    }
    else if(response.status===401){
        alert("incorrect password.please try again");
    
    }
    else{
        console.log("error",response.statusText);
        alert("an error occured ,please try again later");
    }
})
.then((data)=>{
    //if data is defined it meams response was successfull
    if(data)
    {
        const queryString=`?id=${data.id}&name=${data.name}&email=${data.email}&createdAt=${data.createdAt}`;
        window.location.href="successfull.html"+queryString;
    }
})
.catch((error)=>{
    console.error("error",error);
    alert("an error occured ,please try again later");
});

});
});