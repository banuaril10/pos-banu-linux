$("#date").val(toDateInputValue(new Date()));
var cashierid = "";
var ad_org_id = "";
var userid = "";
var useridval = "";
var strsalesdate = "";
// var ip_local = "http://10.0.106.2";
var ip_local = "http://localhost";

getinfo();
$("#loaderpos").hide();
function getinfo(){
  var objinfo = JSON.parse(localStorage.getItem('info'));
  var objuser = JSON.parse(localStorage.getItem('user'));
  cashierid=objinfo.cashierid;
  userid=objuser.id;
  useridval=objuser.userid;
  ad_org_id=objinfo.ad_morg_key;
  // divshopname.innerHTML =  objinfo.shopname;
  // divcashiername.innerHTML =  objinfo.cashiername;    
  // divusername.innerHTML =  objuser.username;
  // divusername1.innerHTML =  objuser.username; //new
  // getbalanceamount();
  console.log(objuser);
};

var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}

function checkOnlineStatus() {
  $.get(
    "https://intransit.idolmartidolaku.com/apiidolmart/sales_order",
    function (data, status) {
      $("#online-status").html("<span class='dot-green'></span> ");
      $("#online-status").css("color", "green");
      //add dot green
      $("#online-status").append("ONLINE");
    }
  ).fail(function () {
    $("#online-status").html("<span class='dot-red'></span> ");
    $("#online-status").css("color", "red");
    //add dot red
    $("#online-status").append("OFFLINE");
  });
}
setInterval(checkOnlineStatus, 2000);

//function with loading spinner

function syncSalesHeader() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_header.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesLine() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_line.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesCashierBalance() {
  var date = $("#date").val();
  var url =
    ip_local + "/pi/api/cyber/sync_sales_cashierbalance.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesDeleted() {
  var date = $("#date").val();
  var url =
    ip_local + "/pi/api/cyber/sync_sales_deleted.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesShopSales() {
  var date = $("#date").val();
  var url =
    ip_local + "/pi/api/cyber/sync_sales_shopsales.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSales() {
  //run all function
  syncSalesHeader();
  syncSalesLine();
  syncSalesCashierBalance();
  syncSalesDeleted();
  syncSalesShopSales();
  alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  getSales();
}

function syncSalesAuto() {
  //run all function
  syncSalesHeader();
  syncSalesLine();
  syncSalesCashierBalance();
  syncSalesDeleted();
  syncSalesShopSales();
  getSales();
}

syncSalesAuto();
//run sync sales every 3 minutes
function toDateInputValue(dateObject) {
  const local = new Date(dateObject);
  local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}

function getSales() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/get_sales.php?date=" + date;
  $.get(url, function (data, status) {
    console.log(data);
    $("#sales").html(data);
  });
}
getSales();

// setInterval(syncSalesAuto, 180000);
setInterval(getSales, 90000);

const btnback = document.getElementById("btnback");
btnback.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/home.html`;
});




const btnshopclose = document.getElementById("btnshopclose");
btnshopclose.addEventListener("click", function (event) {
  // synctable('pos_dorder','pos_dorder_sync_view','pos_dsalesorderlocal_sync','pos_dorder_sync_update');
  // var stdstatus = getValueStd();
  // if(stdstatus == 1){

  var objstatus = get_auth_data(
    "/pos/dcashierbalance_shopclose_check",
    { f1: cashierid },
    false
  );
  if (objstatus.message == "Confirm") {
    $.each(objstatus.data, function (i, item) {
      strsalesdate = item.salesdate;
      $("#divshopsalesdate").html(item.salesdate);
    });
    //  $('#shopclosemod').modal('show');
    if (isDialogSupported) {
      shopclosemod.showModal();
    } else {
      shopclosemod.setAttribute("open", "");
    }
    // shopclosemod.querySelector("input").focus();
  } else {
    showalert("Maaf", objstatus.message);
  }

  // }else{

  // showalert('Maaf','STD LOKAL dan WEBPOS belum balance. Silahkan hubungi tim EDP yg sedang piket.. Terima kasih');

  // }
});
// submit close shop
const btnshopclosesubmit = document.getElementById("btnshopclosesubmit");
btnshopclosesubmit.addEventListener("click", async function (event) {
  if ($("#shopclosingremark").val() != "") {
    var objresult = await post_auth_data(
      "/pos/dshopsales_closing",
      { f1: strsalesdate, f2: $("#shopclosingremark").val() },
      false
    );
    if (objresult.success) {
      shopclosemod.close();
      genshopclosetoprint(strsalesdate, false);
      $("#divcashierbalance").html("Rp. 0");
      // Sync to Server
      synctable(
        "pos_dorder",
        "pos_dorder_sync_view",
        "pos_dsalesorderlocal_sync",
        "pos_dorder_sync_update"
      );
    } else {
      alert(objresult.result);
    }
  } else {
    alert("DATA TIDAK LENGKAP !");
  }
});


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