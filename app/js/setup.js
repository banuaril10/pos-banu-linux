require("jquery");
require('popper.js');
require('bootstrap');
var $ = require("jquery");

// get cashier information 
$('#loaderpos').html("<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />");
// getinfo();
// getproductinfo();
$('#loaderpos').hide();



var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}


// log out
const btnback=document.getElementById('btnback');
btnback.addEventListener('click',function (event){
  window.location.href =`file:///${__dirname}/home.html`;
})


//Sync Profile
// const btnorgsync=document.getElementById('btnorgsync');
// btnorgsync.addEventListener('click',async function (event){
 
//   var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'ad_morg'},true);
//    if (objsync.count>0){ 
//     $('#loaderpos').show();
//      var intloop=0;
//      var intlimit=100;
//     for (var i = 0; i < objsync.count; i=i+intlimit) { 
//       var objsyncsub= await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_ad_org_sync_view',f3:'ad_morg_sync',f4:intlimit,f5:intloop*intlimit},false);
//        intloop++;
//      };  
//     $("#loaderpos").hide();
//   };
   
// });

//sync User
// const btnusersync=document.getElementById('btnusersync');
// btnusersync.addEventListener('click', async function (event){ 
//    var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'ad_muser'},true);
//     if (objsync.count>0){  
//       $('#loaderpos').show();
//       var intloop=0;
//       var intlimit=100;
//       for (var i = 0; i < objsync.count; i=i+intlimit) { 
//         var objsyncsub=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_ad_muser_sync_view',f3:'ad_muser_sync',f4:intlimit,f5:intloop*intlimit},false);
//           intloop++;
//         };  
//      $("#loaderpos").hide();
//    };
// });


// const btnbanksync=document.getElementById('btnbanksync');
// btnbanksync.addEventListener('click',async function (event){
//   var objsync=await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'pos_mbank'},true);
//    if (objsync.count>0){ 
//      $('#loaderpos').show(); 
//      var intloop=0;
//      var intlimit=100;
//     for (var i = 0; i < objsync.count; i=i+intlimit) { 
//       var objsyncsub=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_pos_mbank_sync_view',f3:'pos_mbank_sync',f4:intlimit,f5:intloop*intlimit},false);
//        intloop++;
//      };
//    };
//     $("#loaderpos").hide();
// });

// const btnedcsync=document.getElementById('btnedcsync');
// btnedcsync.addEventListener('click', async function (event){
//   var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'pos_medc'},true);
//   if (objsync.count>0){ 
//      $('#loaderpos').show();
//      var intloop=0;
//      var intlimit=100;
//     for (var i = 0; i < objsync.count; i=i+intlimit) { 
//       var objsyncsub=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_pos_medc_sync_view',f3:'pos_medc_sync',f4:intlimit,f5:intloop*intlimit},false);
//        intloop++;
//      };  
//     $("#loaderpos").hide();
//   };
// });

const btnreset=document.getElementById('btnreset');
btnreset.addEventListener('click', async function (event){
  if (confirm('Semua Transaksi Penjualan akan di hapus..,Apakah Anda Yakin?')) {
    $('#loaderpos').show();
    var objreset= await post_auth_data("/pos/reset",{},false);
     $("#loaderpos").hide();
    if (objreset.result=="Success"){
       alert("DATA PENJUALAN SUDAH DI RESET..");
    } else {
      alert("RESET FAIL!");
    };
  };
});

const btnresetmaster=document.getElementById('btnresetmaster');
btnresetmaster.addEventListener('click', async function (event){
  if (confirm('Master Data Product, Harga, Promo dll akan di hapus,Apakah Anda Yakin?')) {
    $('#loaderpos').show();
    var objresetmaster= await post_auth_data("/pos/resetmaster",{},false);
     $("#loaderpos").hide();
    if (objresetmaster.result=="Success"){
       alert("MASTER DATA SUDAH DI RESET..");
    } else {
      alert("RESET FAIL!");
    };
  };
});

const btnrestore = document.getElementById("btnrestore");
btnrestore.addEventListener("click", async function (event) {
  if (
    confirm(
      "Data Sales Akan direstore,Apakah Anda Yakin?"
    )
  ) {
    restore_data_sales();
  }
});


function restore_data_sales(){
   $("#loaderpos").show();
   var date = $("#date").val();
   var url = ip_local + "/pi/api/cyber/restore_sales.php";
   $.get(url, function (data, status) {
      console.log(data);
      $("#loaderpos").hide();
   });
}