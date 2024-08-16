let submit = document.querySelector('input[type="submit"]');
const email = document.querySelector('#username');
const pass1 = document.querySelector('#pass1');
const pass2 = document.querySelector('#pass2');
console.log(submit);
submit.addEventListener('click', async (e) => {
    e.preventDefault();
    let data = {
        username: email.value,
        pass1: pass1.value,
        pass2: pass2.value
    }
    let res = await fetch('http://localhost:3000/signup', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    let resData = await res.json();
    console.log(resData);
    if(resData.redirect != "/login"){
        console.log("resData: ",resData);
        res = await fetch('http://localhost:3000/wait');
        resData = await res.json();
    }
    //another fetch for redirect
    //redirect
    window.location.href = `http://localhost:3000${resData.redirect}`;
})