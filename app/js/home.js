require("jquery");
require('popper.js');
require('bootstrap');
var $ = require("jquery");
var cashierid="";
var ad_org_id="";
var userid="";
var useridval="";
var strsalesdate="";

$('#loaderpos').html("<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />");

$("#balanceamount").mask("000,000,000", {reverse: true});
$("#actualamount").mask("000,000,000", {reverse: true});
// get cashier information
getinfo();
$("#loaderpos").hide();
function getinfo(){
  var objinfo = JSON.parse(localStorage.getItem('info'));
  var objuser = JSON.parse(localStorage.getItem('user'));
  cashierid=objinfo.cashierid;
  userid=objuser.id;
  useridval=objuser.userid;
  ad_org_id=objinfo.ad_morg_key;
  divshopname.innerHTML =  objinfo.shopname;
  divcashiername.innerHTML =  objinfo.cashiername;    
  divusername.innerHTML =  objuser.username;
  divusername1.innerHTML =  objuser.username; //new
  getbalanceamount();
  console.log(objuser);
};

var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}

var objshift=get_auth_data("/selects/select_filter",{f1:'',f2:'', f3: 'pos_mshift_get',f4:'' },false);
    var strshiftoption='';
   // strbuildingoption += '<option value="%">All</option>';
  $.each(objshift.data, function (i,item) {
      strshiftoption += '<option value="' + item.id + '">' + item.text + '</option>';
  });
$('#divshift').html('<select id="shift" class="form-control pull-right" placeholder="Shift" >'+strshiftoption+'</select>' );
 

// saldo awal click
const btnbalance=document.getElementById('btnbalance');
btnbalance.addEventListener('click',function (event){
  var objcheck=get_auth_data("/pos/dcashierbalance_insert_check",{},false);
  if (objcheck.message=='Confirm') {
     if (isDialogSupported) {
      balancemod.showModal();
     } else {
      balancemod.setAttribute("open", "");
     };
     balancemod.querySelector("input").focus();
  } else {
    showalert('Maaf',objcheck.message);
  };
})

// submit saldo awal
const btnbalancesubmit=document.getElementById('btnbalancesubmit');
btnbalancesubmit.addEventListener('click',async function (event){ 
  if ($("#balanceamount").val()!="") {
    var objresult=await post_auth_data('/pos/dcashierbalance',{ f1: cashierid,f2: $('#shift').val(), f3:$("#balanceamount").val().replace(/,/g, '') },false);
    console.log(objresult);
    if (objresult.result=='success') { 
      var objbalanceprint=get_auth_data("/pos/dcashierbalanceprint",{},false);
        genbalancetoprint(objbalanceprint,false);
        // genbalancetoprintvsc(objbalanceprint,false);
		
        balancemod.close();
        getbalanceamount();
    } else {
      alert(objresult.result);
    }
  } else {
    alert('DATA BELUM LENGKAP !');
  };

});


// Cashier Close click
const btncashierclose=document.getElementById('btncashierclose');
btncashierclose.addEventListener('click',function (event){
  var objcashierclose=get_auth_data("/pos/dcashierbalance_cashierclose_check",{},false);
  var strsalesamount='';
  if (objcashierclose.message =='Confirm'){
    $.each(objcashierclose.data, function (i,item) {
      strsalesamount=item.salesamount;
      strsalesdate=item.salesdate;
      $('#divsalesdate').html(item.salesdate);
    });
    if (isDialogSupported) {
      cashierclosemod.showModal();
     } else {
      cashierclosemod.setAttribute("open", "");
     };
     $('#actualamount').val('');
     cashierclosemod.querySelector("input").focus();
  //  $('#cashierclosemod').modal('show');

} else {
  showalert('Maaf',objcashierclose.message);
};
   
  
});

// submit close cashier
const btncashierclosesubmit=document.getElementById('btncashierclosesubmit');
btncashierclosesubmit.addEventListener('click',async function (event){ 
  if ($("#actualamount").val()!="") {
    var objresult=await post_auth_data('/pos/dcashierbalance_closing',{ f1: cashierid,f2:$("#actualamount").val().replace(/,/g, '') },false);
    if (objresult.success) { 
        cashierclosemod.close();

        var objcashiercloseprint=get_auth_data("/pos/dcashierbalancecloseprint",{f1:strsalesdate},false);
        gencashierclosetoprint(objcashiercloseprint,false);

        $('#divcashierbalance').html('KASIR DI TUTUP');
    } else {
      alert(objresult);
    };
  } else {
    alert("DATA TIDAK LENGKAP !");
  };
});


// Shop Close click
// const btnshopclose=document.getElementById('btnshopclose');
// btnshopclose.addEventListener('click',function (event){


//  // synctable('pos_dorder','pos_dorder_sync_view','pos_dsalesorderlocal_sync','pos_dorder_sync_update');
// 	// var stdstatus = getValueStd();
// 	// if(stdstatus == 1){
		
		
// 	var objstatus=get_auth_data("/pos/dcashierbalance_shopclose_check",{f1:cashierid },false);
// 	if (objstatus.message=="Confirm") {
//     $.each(objstatus.data, function (i,item) {
//       strsalesdate=item.salesdate;
//       $('#divshopsalesdate').html(item.salesdate);
//     });
//   //  $('#shopclosemod').modal('show');
//     if (isDialogSupported) {
//       shopclosemod.showModal();
//     } else {
//       shopclosemod.setAttribute("open", "");
//     };
//     // shopclosemod.querySelector("input").focus();
//   } else
//   {
//       showalert('Maaf',objstatus.message);
//   }
		
		
		
// 	// }else{
		
// 		// showalert('Maaf','STD LOKAL dan WEBPOS belum balance. Silahkan hubungi tim EDP yg sedang piket.. Terima kasih');
		
// 	// }



// });
// submit close shop
const btnshopclosesubmit=document.getElementById('btnshopclosesubmit');
btnshopclosesubmit.addEventListener('click',async function (event){ 

	

	if ($("#shopclosingremark").val()!="") {
      var objresult=await post_auth_data('/pos/dshopsales_closing',{ f1:strsalesdate,f2:$("#shopclosingremark").val() },false);
      if (objresult.success) { 
          shopclosemod.close();
          genshopclosetoprint(strsalesdate,false);
          $('#divcashierbalance').html('Rp. 0');
          // Sync to Server
          synctable('pos_dorder','pos_dorder_sync_view','pos_dsalesorderlocal_sync','pos_dorder_sync_update');

      } else {
        alert(objresult.result);
      };
    } else {
      alert("DATA TIDAK LENGKAP !");
	};
	
	
	
});

// log out
const btnlogout=document.getElementById('btnlogout');
btnlogout.addEventListener('click',async function (event){
  var objresult=await post_auth_data('/pos/logout',{ f1: cashierid },false);
  if (objresult.success) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href =`file:///${__dirname}/login.html`;
  } else {
    alert("Log out fail !");
  };

})


function showOS() {
  if (is.windows())
    console.log("Windows Detected.")
  if (is.macOS())
  console.log("Apple OS Detected.")
  if (is.linux())
  console.log("Linux Detected.")
}

// button pos click
const btnpos=document.getElementById('btnpos');
btnpos.addEventListener('click',function (event){

   var balanceamount=0;
   var objcheck=get_auth_data("/pos/dcashierbalance_bycashier",{f1:'RUNNING' },false);
  if (objcheck.message=='RUNNING') {
    $.each(objcheck.data, function (i,item) {
      balanceamount=item.balanceamountvalue;
    });
    window.location.href =`file:///${__dirname}/index.html`;
  } else if (objcheck.message=='CLOSE') {
      showalert('Maaf','KASIR SUDAH DI TUTUP !');
    } else {
      showalert('Maaf',objcheck.message);
    };

});

const btncashin = document.getElementById("btncashin");
btncashin.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/cashin.html`;
});

const btnproduct=document.getElementById('btnproduct');
btnproduct.addEventListener('click',function (event){
    window.location.href =`file:///${__dirname}/product.html`;
});

const btnlaporan = document.getElementById("btnlaporan");
btnlaporan.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/report.html`;
});

;

const btnsalesorder = document.getElementById("btnsalesorder");
btnsalesorder.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/sales_order.html`;
});

const btnsetup=document.getElementById('btnsetup');
btnsetup.addEventListener('click',function (event){
  openpassword();
  //  window.location.href =`file:///${__dirname}/setup.html`;
});


const btnpricetag = document.getElementById("btnpricetag");
btnpricetag.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/pricetag.html`;
});

;

const btnchangepassword=document.getElementById('btnchangepassword');
btnchangepassword.addEventListener('click',function (event){
  if (isDialogSupported) {
    changepasswordmode.showModal();
   } else {
    changepasswordmode.setAttribute("open", "");
   };
});


const btnreprintoption=document.getElementById('btnreprintoption');
btnreprintoption.addEventListener('click',function (event){
  if (isDialogSupported) {
    reprinoptionmod.showModal();
   } else {
    reprinoptionmod.setAttribute("open", "");
   };
});

//btnreprintbalance
const btnreprintbalance=document.getElementById('btnreprintbalance');
btnreprintbalance.addEventListener('click',function (event){
  reprinoptionmod.close();
  if (isDialogSupported) {
    reprinbalancemod.showModal();
   } else {
    reprinbalancemod.setAttribute("open", "");
   };
});


const btnreprintbalancesubmit=document.getElementById('btnreprintbalancesubmit');
btnreprintbalancesubmit.addEventListener('click',function (event){
  var objbalanceprint=get_auth_data("/pos/dcashierbalancereprint",{f1:$('#cashierbalanceid').val()},false);
  genbalancetoprint(objbalanceprint,true);
  // genbalancetoprintvsc(objbalanceprint,true);
});


//btnreprintCashier
const btnreprintcashier=document.getElementById('btnreprintcashier');
btnreprintcashier.addEventListener('click',function (event){
  reprinoptionmod.close();
  if (isDialogSupported) {
    reprintcashierclose.showModal();
   } else {
    reprintcashierclose.setAttribute("open", "");
   };
});
const btnreprintcashierclosesubmit=document.getElementById('btnreprintcashierclosesubmit');
btnreprintcashierclosesubmit.addEventListener('click',function (event){
  var objcashiercloseprint=get_auth_data("/pos/dcashierbalanceclosereprint",{f1:$('#reprintcashiercloseid').val()},false);
  gencashierclosetoprint(objcashiercloseprint,true);
});

//btnreprintShop
const btnreprintshop=document.getElementById('btnreprintshop');
btnreprintshop.addEventListener('click',function (event){
  reprinoptionmod.close();
  if (isDialogSupported) {
    reprintshopclose.showModal();
   } else {
    reprintshopclose.setAttribute("open", "");
   };
});

const btnreprintshopclosesubmit=document.getElementById('btnreprintshopclosesubmit');
btnreprintshopclosesubmit.addEventListener('click',function (event){
  genshopclosetoprint($('#reprintshopcloseid').val(),true);
});


const btnchangepasswordsubmit=document.getElementById('btnchangepasswordsubmit');
btnchangepasswordsubmit.addEventListener('click',async function (event){
  if ($('#oldpwd').val()===$('#newpwd').val())
  {
        alert('PASSWORD TIDAK BOLEH SAMA !');
  }
  else
  {
    var oldpwd = $('#oldpwd').val();
    var newpwd = $("#newpwd").val();
    changepassword(oldpwd, newpwd);
    
  }
});

function changepassword(oldpwd, newpwd) {
  $("#loaderpos").show();
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/change_password.php?oldpwd=" +
      oldpwd +
      "&newpwd=" +
      newpwd +
      "&userid=" +
      useridval,
    type: "GET",
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      $("#loaderpos").hide();
      $("#status_cp").html(dataResult.message);
      // alert(dataResult.message);
    },
  });
}


// Modal first Focus
$('#balancemod').on('shown.bs.modal', function () {
  $('#shift').focus();
});
$('#btnbalance').focus();

function getbalanceamount(){
  var objbalancedata=get_auth_data("/pos/dcashierbalance_bycashier",{f1:'RUNNING'},false);
  if (objbalancedata.message=='RUNNING') {
    $.each(objbalancedata.data, function (i,item) { 
      $('#divcashierbalance').html('Rp. '+item.balanceamount);
      $('#divintbill').html(item.intbill);
    });
  } else if(objbalancedata.message=='CLOSE') {
    $('#divcashierbalance').html('KASIR TUTUP');
  } else {
    $('#divcashierbalance').html('Rp. 0');
  };
};

function genbalancetoprint(_objbalanceprint,_isreprint){
   var strcontent='';
   $.each(_objbalanceprint.data, function (i,item) {
     strcontent+=textbyline(item.clientname,38,'center')+'\r\n';
     strcontent+=textbyline(item.address1,38,'center')+'\r\n';
     strcontent+=textbyline(item.address2,38,'center')+'\r\n';
     if (_isreprint){
      strcontent+=textbyline('REPRINT',38,'left')+'\r\n';
     };
     strcontent+=textbyline("=======================================",38,'center')+'\r\n';
     strcontent+=textbyline('KASIR      :',10,'left')+''+textbyline(item.postby,20,'right')+'\r\n';
     strcontent+=textbyline('TANGGAL    :',13,'left')+''+textbyline(item.strdate,28,'right')+'\r\n';
     strcontent+=textbyline('SALDO AWAL :',13,'left')+''+textbyline(item.balanceamount,28,'right')+'\r\n';
     strcontent+=textbyline("=======================================",38,'center')+'\r\n';
     strcontent+=textbyline(item.strdate+' '+item.strtime,38,'left')+'\r\n';
	 
	if(jenis_printer == "dot"){
			  
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			  
	}

   });
    print(strcontent);

};


// function genbalancetoprintvsc(_objbalanceprint,_isreprint){
   // var strcontent='';

   // $.each(_objbalanceprint.data, function (i,item) {
     // strcontent+="            "+item.clientname+"\r\n";
     // strcontent+="            "+item.address1+"\r\n";
     // strcontent+="              "+item.address2+"\r\n";

     // if (_isreprint){
     
      // strcontent+='REPRINT      \r\n';
     // };
	 
     // strcontent+= "=============================\r\n";
     // strcontent+= 'KASIR      :       '+item.postby+'\r\n';
     // strcontent+= 'TANGGAL    :       '+item.strdate+'\r\n';
     // strcontent+= 'SALDO AWAL :  '+item.balanceamount+'\r\n';
     // strcontent+= "=============================\r\n";
     // strcontent+= item.strdate+' '+item.strtime+'\r\n';
     // strcontent+= "  \r\n";
     // strcontent+= "  \r\n";
     // strcontent+= "  \r\n";
     // strcontent+= "  \r\n";
     // strcontent+= "  \r\n";
     // strcontent+= "  \r\n";
   // });
    // print(strcontent);

// };

function gencashierclosetoprint(_objcashiercloseprint,_isreprint){
  var strcontent='';
  var strnocast='';
  var strdatetime='';

  $.each(_objcashiercloseprint.data2, function (i,item) {
    strnocast+=textbyline(addspace(item.edcname,17)+':',38,'left')+''+textbyline(item.amount,20,'right')+'\r\n';
  });

  $.each(_objcashiercloseprint.data, function (i,item) {
    strdatetime='"'+item.postby+'": '+item.strdate+' ~ '+item.strtime;
    strcontent+=textbyline(item.clientname,38,'center')+'\r\n';
    strcontent+=textbyline(item.address1,38,'center')+'\r\n';
    strcontent+=textbyline(item.address2,38,'center')+'\r\n';
    if (_isreprint){
      strcontent+=textbyline('REPRINT',38,'left')+'\r\n';
     };
    strcontent+=textbyline('TANGGAL    :'+item.strdate,38,'center')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('Penjualan        :',13,'left')+''+textbyline(item.salesamount,20,'right')+'\r\n';
    strcontent+=textbyline('Diskon           :',13,'left')+''+textbyline(item.discount,20,'right')+'\r\n';
   // strcontent+=textbyline('Diskon Member    :',13,'left')+''+textbyline(item.memberdiscount,20,'right')+'\r\n';
    strcontent+=textbyline('Refund           :',13,'left')+''+textbyline(item.refundamount,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('Penjualan Bersih :',13,'left')+''+textbyline(item.totalsalesamount,20,'right')+'\r\n';

    // strcontent+=textbyline('Debit BCA        :',13,'left')+''+textbyline(item.debitbca,20,'right')+'\r\n';
    // strcontent+=textbyline('Debit Mandiri    :',13,'left')+''+textbyline(item.debitmandiri,20,'right')+'\r\n';
    // strcontent+=textbyline('Credit BCA       :',13,'left')+''+textbyline(item.creditbca,20,'right')+'\r\n';
    // strcontent+=textbyline('Credit Mandiri   :',13,'left')+''+textbyline(item.creditmandiri,20,'right')+'\r\n';
    strcontent+=strnocast;
    strcontent+=textbyline('Voucher          :',13,'left')+''+textbyline(item.voucher,20,'right')+'\r\n';
    strcontent+=textbyline('Reedem Point     :',13,'left')+''+textbyline(item.pointamount,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline(item.total,20,'right')+'\r\n';
    strcontent+='\r\n';
    strcontent+=textbyline('Batal            :',13,'left')+''+textbyline(item.cancelcount,20,'right')+'\r\n';
    strcontent+=textbyline('Infak            :',13,'left')+''+textbyline(item.donasiamount,20,'right')+'\r\n';
    strcontent+=textbyline('Modal            :',13,'left')+''+textbyline(item.modalamount,20,'right')+'\r\n';
    strcontent+=textbyline('Cash In Drawer   :',13,'left')+''+textbyline(item.actualamount,20,'right')+'\r\n';
    strcontent+=textbyline('Variant          :',13,'left')+''+textbyline(item.varianamount,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
      });
    strcontent+=textbyline("BY CATEGORY",38,'center')+'\r\n';
   
    var totcategory=0;
    $.each(_objcashiercloseprint.category, function (i,item) {
      totcategory=totcategory+item.amount;
      strcontent+=textbyline(item.categoryname,1,'left')+''+textbyline(item.stramount,38-item.categoryname.length,'right')+'\r\n';
    });
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline((totcategory).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00',''),20,'right')+'\r\n';

    // Category
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
   // strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline(item.balanceamount,28,'right')+'\r\n';
    strcontent+=textbyline(strdatetime,38,'left')+'\r\n';
	if(jenis_printer == "dot"){
			  
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			  
	}

   print(strcontent);
   // sendtoprinter();
};

function genshopclosetoprint(strdate,_isreprint){
  var strcontent='';
  var strnocast='';
  var strdatetime='';
  var objshopcloseprint=get_auth_data("/pos/dshopsalescloseprint",{f1:strdate},false);

  $.each(objshopcloseprint.data2, function (i,item) {
    strnocast+=textbyline(addspace(item.edcname,17)+':',38,'left')+''+textbyline(item.amount,20,'right')+'\r\n';
  });

  $.each(objshopcloseprint.data, function (i,item) {
    strdatetime='"'+item.postby+'": '+item.strdate+' ~ '+item.strtime;
    strcontent+=textbyline(item.clientname,38,'center')+'\r\n';
    strcontent+=textbyline(item.address1,38,'center')+'\r\n';
    strcontent+=textbyline(item.address2,38,'center')+'\r\n';
    if (_isreprint){
      strcontent+=textbyline('REPRINT',38,'left')+'\r\n';
     };
    strcontent+=textbyline('TANGGAL    :'+item.strdate,38,'center')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('Penjualan        :',13,'left')+''+textbyline(item.salesamount,20,'right')+'\r\n';
    strcontent+=textbyline('Diskon           :',13,'left')+''+textbyline(item.discount,20,'right')+'\r\n';
  //  strcontent+=textbyline('Diskon Member    :',13,'left')+''+textbyline(item.memberdiscount,20,'right')+'\r\n';
    strcontent+=textbyline('Refund           :',13,'left')+''+textbyline(item.refundamount,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('Penjualan Bersih :',13,'left')+''+textbyline(item.totalsalesamount,20,'right')+'\r\n';
    strcontent+=strnocast;
    // strcontent+=textbyline('Debit BCA        :',13,'left')+''+textbyline(item.debitbca,20,'right')+'\r\n';
    // strcontent+=textbyline('Debit Mandiri    :',13,'left')+''+textbyline(item.debitmandiri,20,'right')+'\r\n';
    // strcontent+=textbyline('Credit BCA       :',13,'left')+''+textbyline(item.creditbca,20,'right')+'\r\n';
    // strcontent+=textbyline('Credit Mandiri   :',13,'left')+''+textbyline(item.creditmandiri,20,'right')+'\r\n';

    strcontent+=textbyline('Voucher          :',13,'left')+''+textbyline(item.voucher,20,'right')+'\r\n';
    strcontent+=textbyline('Reedem Point     :',13,'left')+''+textbyline(item.pointamount,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline(item.totalcash,20,'right')+'\r\n';
    strcontent+='\r\n';
    strcontent+=textbyline('Batal            :',13,'left')+''+textbyline(item.cancelcount,20,'right')+'\r\n';
    strcontent+=textbyline('Infak            :',13,'left')+''+textbyline(item.donasiamount,20,'right')+'\r\n';
    strcontent+=textbyline('Modal            :',13,'left')+''+textbyline(item.modalamount,20,'right')+'\r\n';
    strcontent+=textbyline('Cash In Drawer   :',13,'left')+''+textbyline(item.actualamount,20,'right')+'\r\n';
    strcontent+=textbyline('Variant(-)       :',13,'left')+''+textbyline(item.varianamountmin,20,'right')+'\r\n';
    strcontent+=textbyline('Variant(+)       :',13,'left')+''+textbyline(item.varianamountplus,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('TOTAL TRANSFER   :',13,'left')+''+textbyline(item.totaltransfer,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
   });
    strcontent+=textbyline("BY CATEGORY",38,'center')+'\r\n';
    var totcategory=0;
    $.each(objshopcloseprint.category, function (i,item) {
      totcategory=totcategory+item.amount;
      strcontent+=textbyline(item.categoryname,1,'left')+''+textbyline(item.stramount,38-item.categoryname.length,'right')+'\r\n';
    });
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline((totcategory).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00',''),20,'right')+'\r\n';
   // strcontent+=textbyline('           TOTAL :',13,'left')+''+textbyline(item.balanceamount,28,'right')+'\r\n';
    strcontent+=textbyline(strdatetime,38,'left')+'\r\n';
    if(jenis_printer == "dot"){
			  
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			  
	}
	
	// console.log(strcontent);
   print(strcontent);
   // sendtoprinter();
};

$('#cashierbalanceid').select2({
  dropdownParent: $('#reprinbalancemod'),
  ajax:
    {
        url: api_url+'/selects/select_filter?f3=pos_dcashierbalance_reprint_get',
        data: function (params, page) {
            console.log(params);
          return {
              f4: params.term, // search term
              page_limit: 10
              };
          },
        dataType: 'json',
        headers: {"Authorization":localStorage.getItem('token').replace('"','')},
        delay: 250,
        processResults: function (data) {
            return {
                results: data.data
                
            };
        }
    }

});


$('#reprintcashiercloseid').select2({
  dropdownParent: $('#reprintcashierclose'),
  ajax:
    {
        url: api_url+'/selects/select_filter?f3=pos_dcashierbalance_reprint_get',
        data: function (params, page) {
            console.log(params);
          return {
              f4: params.term, // search term
              page_limit: 10
              };
          },
        dataType: 'json',
        headers: {"Authorization":localStorage.getItem('token').replace('"','')},
        delay: 250,
        processResults: function (data) {
            return {
                results: data.data
                
            };
        }
    }

});


$('#reprintshopcloseid').select2({
  dropdownParent: $('#reprintshopclose'),
  ajax:
    {
        url: api_url+'/selects/select_filter?f3=pos_dshopsales_reprint_get',
        data: function (params, page) {
            console.log(params);
          return {
              f4: params.term, // search term
              page_limit: 10
              };
          },
        dataType: 'json',
        headers: {"Authorization":localStorage.getItem('token').replace('"','')},
        delay: 250,
        processResults: function (data) {
            return {
                results: data.data
                
            };
        }
    }

});


async function synctable(strtable,funcsourcedata,functargetdata,funcsourceupdate){
 // var objsync= get_auth_data("/pos/postablecount",{f1:strtable},false);
 // console.log(objsync.data.count);
 //  if (objsync.data.count>0){ 
     $('#loaderpos').show(); 
  //   var intloop=0;
  //    var intlimit=100;
  //     for (var i = 0; i < objsync.data.count; i=i+intlimit) { 
         var objsyncsub=await post_async_auth_data("/pos/postabledata",{f1:funcsourcedata,f2:functargetdata,f3:funcsourceupdate,f4:100,f5:0},false);
        console.log(objsyncsub);
   //      intloop++;
   //    };
   //    $("#loaderpos").hide();
  // };
    $("#loaderpos").hide();
};

$('#usersupervisor').select2({
  dropdownParent: $('#passwordmod'),
  ajax:
    {
        url: api_url+'/selects/select_filter?f3=pos_supervisor_user_get',
        data: function (params, page) {
          return {
              //f4: params.term, // search term
			  f4: useridval,
              page_limit: 10
              };
          },
        dataType: 'json',
        headers: {"Authorization":localStorage.getItem('token').replace('"','')},
        delay: 250,
        processResults: function (data) {
			
			//alert(userid);
			
            return {
                results: data.data        
            };
        }
    }

});

// Supervisor Password
$('#usersupervisor').on('select2:select', function (e) {
  var now = new Date();
// console.log(now.getMinutes());
 var intcode=parseInt(now.getDay()+''+now.getSeconds())*3;
  $("#genid").val(intcode);
  $("#supervisorpwd").focus();
});

function openpassword(){
  $('#usersupervisor').val('');
  $("#genid").val('');
  $("#supervisorpwd").val('');
  if (isDialogSupported) {
    passwordmod.showModal();
  } else {
    passwordmod.setAttribute("open", "");
  };
  passwordmod.querySelector("input").focus();
};

//supervisorpwd
$('#supervisorpwd').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    passwordvalidation();
  };
}); 

//buttonpasswordsubmit
const buttonpasswordsubmit=document.getElementById('buttonpasswordsubmit');
buttonpasswordsubmit.addEventListener('click',async function (event){
  passwordvalidation();
});

async function passwordvalidation(){
var objpassword=get_auth_data("/pos/supervisor",{f1: $("#usersupervisor").val(),f2:$("#genid").val(),f3:$("#supervisorpwd").val() },false);
  if (objpassword.result=="Confirm") {
    window.location.href =`file:///${__dirname}/setup.html`;
  }  else {
  //  alert(objpassword.result);
    $('#passwordalert').html(objpassword.result);
  }
};


// const btnstockjob=document.getElementById('btnstockjob');
// btnstockjob.addEventListener('click', async function (event){


//   var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'pos_mproductlocator'},true);
//   if (objsync.count>0){ 
//      $('#loaderpos').show();
//      var intloop=0;
//      var intlimit=1000;
//     for (var i = 0; i < objsync.count; i=i+intlimit) { 
//       var objsyncstock=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_pos_mproductlocator_sync_view',f3:'pos_mproductlocator_sync',f4:intlimit,f5:intloop*intlimit},false);
//        intloop++;
//      };  
//     $("#loaderpos").hide();
//   };

  // var objsync= await get_async_auth_data("/pos/lastupdate",{api:api_url,f1:ad_org_id,f2:'PRODUCT STOCK'},true);
  //  if (objsync.success){ 
  //   $('#loaderpos').show();
  //     console.log(objsync.result.postdate);                                  // f1:'',f2:view function,f3:update function,f4:p_updated,f5:p_limit,f6:p_offset 
  //     var objsyncstock=await post_async_auth_data("/pos/tabledata_update",{api:api_url,f1:'',f2:'proc_pos_mproductlocator_sync_view',f3:'pos_mproductlocator_sync',f4:objsync.result.postdate,f5:500,f6:0},false);
  //     console.log(objsyncstock);
  //     $("#loaderpos").hide();
  //   }
     
  //    $('#loaderpos').show();
  //    var intloop=0;
  //    var intlimit=100;
  //   for (var i = 0; i < objsync.count; i=i+intlimit) { 
  //     var objsyncstock=await post_async_auth_data("/sync/tabledata",{api:api_url,f1:'',f2:'proc_pos_mproductlocator_sync_view',f3:'pos_mproductlocator_sync',f4:intlimit,f5:intloop*intlimit},false);
  //      intloop++;
  //    };  
  //   $("#loaderpos").hide();
  //   getproductinfo();
  //   $('#tableproduct').DataTable().ajax.reload();
  // };
// });

function getDataLinkPpob(){
		var links = "";
		$.ajax({
				url: "https://pi.idolmartidolaku.com/api/cek_link_ppob.php",
				type: "GET",
				async: false,
				success: function(dataResult){
					
					links = dataResult;
					// console.log("http://"+api_storeapps+"/pi/api/cek_notes_go.php?nominal="+nominal);
					// console.log(dataResult);

					// $("#namapic").html(dataResult);
					// gotoscan();
				}
		});
		return links;
}

function openPpob() {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
	var link_ppob = getDataLinkPpob();
    const win = new BrowserWindow({
					width: 1440,
					height:1080
				});
   // win.insertCSS('html, body { overflow: hidden; }')
    win.loadURL(link_ppob);
}

// const btnpricejob=document.getElementById('btnpricejob');
const btnppob=document.getElementById('btnppob');
btnppob.addEventListener('click', async function (event){
	
	
	openPpob();
	
  // var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'pos_mproduct'},true);
  // if (objsync.count>0){  
    // $('#loaderpos').show();
    // var intloop=0;
    // var intlimit=1000;
    // for (var i = 0; i < objsync.count; i=i+intlimit) { 
      // var objsyncsub=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_pos_mproductprice_sync_view',f3:'pos_mproductprice_sync',f4:intlimit,f5:intloop*intlimit},false);
        // intloop++;
      // };  
   // $("#loaderpos").hide();
  // };

});

// const btnmember=document.getElementById('btnmember');
// btnmember.addEventListener('click', async function (event){
//   var objsync= await post_async_auth_data("/pos/tablecount",{api:api_url,f1:'',f2:'pos_mmember'},true);
//   if (objsync.count>0){  
//     $('#loaderpos').show();
//     var intloop=0;
//     var intlimit=1000;
//     for (var i = 0; i < objsync.count; i=i+intlimit) { 
//       var objsyncsub=await post_async_auth_data("/pos/tabledata",{api:api_url,f1:'',f2:'proc_pos_mmember_sync_view',f3:'pos_mmember_sync',f4:intlimit,f5:intloop*intlimit},false);
//         intloop++;
//       };  
//    $("#loaderpos").hide();
//   };
// });

function getValueStd(){
    var datax = 1;

    $.ajax({
		async: false,
		url: "http://"+api_storeapps+"/pi/api/cek_omset.php",
		success: function(dataResult) {
			datax = dataResult;
	}});

    return datax;
}

// function getValueStd(){
		// $.ajax({
				// url: "http://"+api_storeapps+"/pi/api/cek_omset.php",
				// type: "GET",
				// success: function(dataResult){
					// console.log(dataResult);
					// return dataResult;
					
				// }
		// });
// }

