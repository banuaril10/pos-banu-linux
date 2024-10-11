
require("jquery");
require('popper.js');
require('bootstrap');
var $ = require("jquery");
var cashierid="0";

$('#print_path').html(has);
$('#userid').focus();
 //Login Action
 $(function () {
  // Validation
  $("#login_form").validate({
      // Rules for form validation
      rules: {
          userid: {
              required: true
          },
          userpwd: {
              required: true,
              minlength: 1,
              maxlength: 20
          }
      },

      // Messages for form validation
      messages: {
        userid: {
              required: 'Please enter your User ID'
          },
          userpwd: {
              required: 'Please enter your password'
          }
      },

      // Do not change code below
      errorPlacement: function (error, element) {
          error.insertAfter(element.parent());
      }
  });

  $('#login_form').on('submit', function (e) {
      e.preventDefault();
      var objlogin=post_data('/pos/auth',{ f1: $('#userid').val(), f2: $('#userpwd').val(), f3: cashierid },false);
    if (objlogin.success) {
        localStorage.setItem('user', JSON.stringify(objlogin.user));
        localStorage.setItem('info', JSON.stringify(objlogin.info));
        localStorage.setItem('token', 'Bearer '+JSON.stringify(objlogin.token).replace('"',''));
        window.location.href =`file:///${__dirname}/home.html`;
        } else {
        $('#login_form').find('.alert').html(objlogin.data).show();
    };
  });

 
});


$('a[href="#exit"]').click(function(){
        window.close();
  }); 


 // Get Shop
 const divshopname=document.getElementById('divshopname');
getcashier();
function getcashier(){
 var objcashier=get_data("/pos/mcashier",{ f1: has },false);
 $.each(objcashier.data, function (i,item) {
          divshopname.innerHTML =  item.shopname;
           divcashiername.innerHTML=item.name;
           cashierid=item.id;
   });
   if (objcashier.data==null) {
      window.location.href =`file:///${__dirname}/register.html`;
   }
 }