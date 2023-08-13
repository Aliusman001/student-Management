const navhover = document.querySelectorAll('.navhover');
console.log(navhover);
for(const value of navhover){
  value.addEventListener('mouseover',()=>{
    value.style.backgroundColor = '#04363a';
  })
  value.addEventListener('mouseleave',()=>{
    value.style.backgroundColor = 'transparent';
  })

}
const year = document.querySelector('.year');
const fYear = Intl.DateTimeFormat('en-US',{year:"numeric"}).format(new Date())
 year.textContent = fYear;

  $(".cws").click(function(){
    $(".cws").addClass("hide");
  })
  $(".alert").fadeIn().delay(5000).fadeOut();
  $(".close").click(function(){
    $(".alert").fadeOut();
  })
  $(".close").click(function(){
    $(".alerts").fadeOut();
  })
  $("#button").click(function(){
    $("#fileselect").click();
    $("#fileselect").attr("onchange", "submit()")
})

  $(".slide").mouseover(function(){
    $(".slide").addClass("hover");
  });

  $(".slide").mouseleave(function(){
    $(".slide").removeClass("hover");
  });

  $(".profile").click(function(){
    $("#fileselect").click();
    $("#fileselect").attr("onchange", "submit()")
})


// Strong Password
$('#password').on('blur', function() {
  var password = $("#password").val();
  var hasNumber = /[0-9]/.test(password);
  var hasUppercase = /[A-Z]/.test(password);
  var hasLowercase = /[a-z]/.test(password);
  var hasSpecialChars = /[$-/:-?{-~!"^_`\[\]]/.test(password);
  if (password.length < 8 || !hasNumber || !hasUppercase || !hasLowercase || !hasSpecialChars) {
    $('#passworderror').text('Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character.');
    $("#submit").addClass("disabled");
    $("#passworderror").addClass("alert alert-danger");
    $("#submit").attr("type", "button");
  } else {
    $('#passworderror').text('');
    $("#submit").removeClass("disabled");
    $("#submit").attr("type", "submit");
    $("#passworderror").removeClass("alert alert-danger");

  }
});






// Confirm Password
    $("#c_password").keyup(function(){
        var pwd = $("#password").val();
        var cpwd = $("#c_password").val();
        if(pwd != cpwd){
            $("#error").text("Password are not Match");
            $("#submit").addClass("disabled");
            $("#error").addClass("alert alert-danger");
            $("#submit").attr("type", "button");
        }
        else{
            $("#error").text("Password are Match");
            $("#submit").removeClass("disabled");
            $("#submit").attr("type", "submit");
            $("#error").removeClass("alert alert-danger");
            $("#error").addClass("alert alert-success");
        }
    
       });
  

       const togglePassword = $('#toggle-password');
       const passwordField = $('#password');
       
       togglePassword.click( function () {
         const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
         passwordField.attr('type', type);
         this.classList.toggle('fa-eye-slash');
       });
       

       const togglec_Password = $('#toggle-c_password');
       const c_password= $('#c_password');
       
       togglec_Password.click( function () {
         const type = c_password.attr('type') === 'password' ? 'text' : 'password';
         c_password.attr('type', type);
         this.classList.toggle('fa-eye-slash');
       });

       const usertoggle = $('#toggleu_password');
       const user_password= $('#user_password');
       
       usertoggle.click( function () {
         const type = user_password.attr('type') === 'password' ? 'text' : 'password';
         user_password.attr('type', type);
         this.classList.toggle('fa-eye-slash');
       });
     
      
     
   
      
