// const userToken = document.cookie.jwt.token
//
// //
// //
// fetch('/users/me', {
//     method: 'POST',
//     headers: {
//      'Authorization': 'Bearer ' + userToken
//     }
// })
// .then(res => res.json())
// .then(data => { console.log(data) })
// .catch(err => { console.log(err) })

const email1=document.getElementById('lg_email');
const  password1=document.getElementById('lg_password');

const submit=document.getElementById('lg_submit').addEventListener('click',(e)=>{
  console.log(email1.value);
  console.log(password1.value);
console.log("dfysuanlkms")
  fetch('/login', {
      method: 'POST', credentials: 'include',
     //  headers: {
     //   'Authorization': 'Bearer ' + userToken
     // },
  //   dataType: "json",

      headers: { 'Content-Type': 'application/json' },

       body: JSON.stringify({email:email1.value,password:password1.value})
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
  console.log(data);
  });

})
