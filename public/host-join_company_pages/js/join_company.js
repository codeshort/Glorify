const company_code = document.getElementById("CompanyCode")
const signin = document.getElementById("signin")
signin.addEventListener('click',(e) => {
  console.log("this")
  const code = company_code.value
  console.log(code)
  console.log(document.cookie)
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    var userToken
    for(var i = 0; i < cookieArr.length; i++)
    {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if('jwt' == cookiePair[0].trim())
        {
            // Decode the cookie value and return
          userToken= cookiePair[1];
        console.log(userToken)
        break;
      }
  }



fetch('/join', {
    method: 'POST',
    headers: {
     'Authorization': 'Bearer ' + userToken
    }
})
.then(res => res.json())
.then(data => { console.log(data) })
.catch(err => { console.log(err) })

})
