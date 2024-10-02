const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    username = usernameInput.value;
    password = passwordInput.value;
    if(username && password){
        let jsonData = {
            username,
            password
        }
        let data = await sendPostReq('/login', jsonData);
        console.log(data);
    }
    else{
        console.log('can not leave email or password blank');
    }
})

async function sendPostReq(route,jsonData){
    let response = await fetch(route,{
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData),
        method: 'POST'
     })
     if(response.redirected){
         //have to redirect
         window.location.assign(response.url);
         return null;
     }
     let data = await response.json();
     return data;
    
}
 