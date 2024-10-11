
 var lastbillno;
 var userid;
 var cashierid;
 var totalpay=0;
 var strbarcodeselected="";
 var intentercount=0;
var divbillno=document.getElementById('divbillno');

var divtotal=document.getElementById('divtotal');
var divshopname=document.getElementById('divshopname');
var divpaychange=document.getElementById('divpaychange');
var divalert=document.getElementById('divalert');
var divMemberName=document.getElementById('divMemberName');

var divDebitPayAfter=document.getElementById('divDebitPayAfter');
//var divCashPointValue=document.getElementById('divCashPointValue');
//var divDebitPointValue=document.getElementById('divDebitPointValue');

var divMemberId=document.getElementById('divMemberId');

var billseqno=0;
var refundbillno="";
var voidmode="";
var strmod="";
var intup=0;
var boolpaymode=false;
var activeid="";
var stritemrefundid="";
var intrefundqty=0;
var paychange=0;
var f8mode=false;
var strpos_dtempsalesline_key="";
var objproductdata=[];
var memberPointValue=0;
var intMemberPoint=0;
var strMemberId="";
var intUltah=0;
var useridval="";
$("#paygiven").mask("000,000,000", {reverse: true});

$("#paycashgiven").mask("000,000,000", {reverse: true});
$("#debitamount").mask("000,000,000", {reverse: true});
$("#debitcard").mask("0000-0000-0000-0000", {reverse: true});

$("#cashdonasiamount").mask("000,000,000", {reverse: true});
$("#debitdonasiamount").mask("000,000,000", {reverse: true});

$("#reedemPointCash").mask("000,000,000", {reverse: true});


initload();
function initload(){
    $('#salesqty').val('1');
    getinfo();
    getlastbill();
    loadpendingsales(userid);
    loadrefund('');
    divalert.innerHTML="Scan Barcode Product ...";
	  getDataPromo(lastbillno);
	// getDataHris();
};

var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
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


function checkOnlineStatus() {
  $.get("http://"+api_storeapps, function (data, status) {
    $("#online-status").html("<span class='dot-green'></span> ");
    $("#online-status").css("color", "green");
    //add dot green
    $("#online-status").append("ONLINE)");
  }).fail(function () {
    $("#online-status").html("<span class='dot-red'></span> ");
    $("#online-status").css("color", "red");
    //add dot red
    $("#online-status").append("OFFLINE)");
  });
}
setInterval(checkOnlineStatus, 5000);


//Set Date
const clockElement = document.getElementById('divtime');
const dateElement = document.getElementById('divdate');
//const dayElement = document.getElementById('divdayname');
var weekdays = new Array(7);
        weekdays[0] = "Minggu";
        weekdays[1] = "Senin";
        weekdays[2] = "Selasa";
        weekdays[3] = "Rabu";
        weekdays[4] = "Kamis";
        weekdays[5] = "Jumat";
        weekdays[6] = "Saptu";
const setCurrentTime = () => {
         var dtnow=new Date();
         var year = dtnow.getFullYear().toString();
         var month = (dtnow.getMonth() + 101).toString().substring(1);
         var day = (dtnow.getDate() + 100).toString().substring(1);
        clockElement.innerHTML =  dtnow.toLocaleTimeString();
        dateElement.innerHTML = day+'-'+month+'-'+year+' '+dtnow.toLocaleTimeString();
       // dayElement.innerHTML=weekdays[dtnow.getDay()]
      };
setCurrentTime();
setInterval(setCurrentTime, 1000);

function pointStatus(){
   $("#reedemPointCash").prop('disabled', true);
   $("#reedemPointDebit").prop('disabled', true);
   $("#reedemPointCredit").prop('disabled', true);
  if (strMemberId !== '') {
    $("#usePoint").prop('disabled', false);
    $("#usePointDebit").prop('disabled', false);
    $("#usePointCredit").prop('disabled', false);
  } else
  {
    $("#usePoint").prop('disabled', true);
    $("#usePointDebit").prop('disabled', true);
    $("#usePointCredit").prop('disabled', true);
  }
}

// search by product name
$('#productname').keypress(function(event){
     var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      objproductdata=get_auth_data("/pos/product",{ f1: $('#productname').val() },false);
      // Clear table
       producttable.clear();
        // Add updated data
        producttable.rows.add(objproductdata.data);
        // Redraw table
        producttable.draw();
        
        if ( producttable.data().count()) {
          producttable.row(':eq(0)', { page: 'current' }).select();
          producttable.cell( ':eq(0)' ).focus();
          $('#productname').blur();
          divalert.innerHTML="Pilih Item Product lalu tekan Enter ..";
        } else {
          showalert("Data Tidak ditemukan !");
        } 
     }
 });  

 // scanning product strpromoName
$('#productbarcode').keypress(function(event){
     var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
       if ($('#productbarcode').val()!="") { 
          for (let i = 0; i < $('#salesqty').val(); i++) {
            getproduct($('#productbarcode').val(),"1",$('#memberid').val(),$('#promoName').val());
          }

          $('#productbarcode').val('');
          $('#salesqty').val('1');
          gotolastrecord(table);
          gotoscan();
        }
    };

 });  

// search by bill no
$('#refundbillno').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
   if(keycode == '13'){
      $('#tablerefund').DataTable().ajax.reload();//counterChecked=0;
      // Row select
      $('#tablerefund').DataTable().row(':eq(0)', { page: 'current' }).select();
      // row focus
      $('#tablerefund').DataTable().cell( ':eq(1)' ).focus();
      $('#refundbillno').blur();
    }
}); 

//refundqty
$('#refundqty').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
 if(keycode == '13' && stritemrefundid !=""){  
   console.log('Masuk di Refun Qty event!!!');
   loadrefunditem(stritemrefundid,$('#refundqty').val(),$('#usersupervisor').val());  
  }
}); 

// Reprint by bill no 
$('#reprintbillno').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      var objprint=get_auth_data("/pos/dsalesprint",{ f1: $("#reprintbillno").val() },false);
      if (objprint.result=="success") {
        genbillpreview(objprint.header,objprint.line);
      } else {
        showalert(objprint.result);
      };
    };
});  

$('#salesqty').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    intentercount=intentercount+1;
    var strfocused = document.activeElement;
    if(keycode == '13' && strbarcodeselected!="" && intentercount >=2){
      console.log('Qty Enter Masuk');
        if ($('#salesqty').val()<=0 ) {
        //  showerror('Quantity Tidak Boleh sama dengan 0 atau kecil dari 0 !');
        showalert('Quantity Tidak Boleh sama dengan 0 atau kecil dari 0 !');
        } else {
            if ($('#salesqty').val() >= 100) {
              if (confirm('Quantity Lebih dari 3 Digit,Apakah Anda Yakin?')) {
                  intentercount=0; 
                  getproduct(strbarcodeselected,$('#salesqty').val(),$('#memberid').val(),$('#promoName').val());
                  $('#salesqty').val('1');
                  gotolastrecord(table);
                  gotoscan();
                 // tableproduct.cell.blur();
                  strbarcodeselected="";
                }; 
            } else {
                intentercount=0;
                getproduct(strbarcodeselected,$('#salesqty').val(),$('#memberid').val(),$('#promoName').val());
                $('#salesqty').val('1');
                gotolastrecord(table);
                gotoscan();
               // tableproduct.cell.blur();
                strbarcodeselected="";
            };
        }
    }  
    event.stopPropagation();
});

 // Catch Enter

$('#debitamount').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#debitcard').focus();
  };

});  
//Debit event enter
$('#debitcard').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#debitapprovecode').focus();
  };
}); 



//Debit Approve event enter
$('#debitapprovecode').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#edcdebitname').focus();
  };
}); 

$('#reedemPointCredit').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#creditcard').focus();
  };
}); 


//Kredit card event enter
$('#creditcard').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#creditapprovecode').focus();
  };
}); 

//Kredit Approve event enter
$('#creditapprovecode').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
        $('#edccreditname').focus();
  };
}); 

//supervisorpwd
$('#supervisorpwd').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    passwordvalidation();
  };
}); 

//Get product by barcode
function getproduct(strbarcode,strqty,strmemberid,strpromoName){
  $.ajax({
        url: api_url+"/pos/mproduct_bybarcode",
        type: "GET",
        global: false,
        data: {f1:lastbillno, f2:strbarcode, f3:strmemberid, f4:strpromoName},
        dataType: "json",
        async: false,
        success: function (res) {
          $.each(res.data, function (i, item) {         
              savetempsales(cashierid,lastbillno,item.sku,strqty,item.price,item.discount,item.discountname,strmemberid);
			  // alert('test');
          });   
        },
        error:function(res) {
        }      
    });
    table.ajax.reload(
      function() {
        gotoscan();
      },false
    );
};

//save sales in progress
function savetempsales(_f1,_f2,_f3,_f4,_f5,_f6,_f7,_f8) {
	$.ajax({
		type: "POST",
		url: api_url+"/pos/dtempsalesline",
		data: JSON.stringify({ f1: _f1,f2:_f2,f3:_f3,f4:_f4,f5:_f5,f6:_f6,f7:_f7,f8:_f8}),
		contentType: "application/json",
		dataType: "json",
		headers: {"Authorization":localStorage.getItem('token').replace('"','')},
		success: function (res) {
          if (res.result =='Success'){
            settotalpay(res.data); 
            checkandShowBuyGet(res.data);
            //if (isbuygetshow === true)   
          } else {
            showalert(res.result);
          };  
				},
		error: function (res) {
					if (res.status==401)
					{
						$('#loginmod').modal('show');
					}
				}
	});
};

//Show Buy Get
function checkandShowBuyGet(data){
  let isShowBuyGet=false
  $.each(data, function (i, item) {
    isShowBuyGet=item.isbuygetshow || false;
  });
  console.log('isShowBuyGet',isShowBuyGet);
  if (isShowBuyGet === true) {
    console.log('Masuk',isShowBuyGet);
    openbuyget();
  }
  
}
  
//save sales in progress
function savetempsalesrefund(_f1,_f2,_f3,_f4,_f5) {
	$.ajax({
		type: "POST",
		url: api_url+"/pos/dtempsalesline_refund",
		data: JSON.stringify({ f1: _f1,f2:_f2,f3:_f3,f4:_f4,f5:_f5}),
		contentType: "application/json",
		dataType: "json",
		headers: {"Authorization":localStorage.getItem('token').replace('"','')},
		success: function (res) {
        settotalpay(res.data);       
				},
		error: function (res) {
      showalert('ERROR !!');
				}
	});
};


// Pending Order
async function salespending(_f1) {
    var objresult=await post_auth_data('/pos/dsalespending',{},false);
  if (objresult.result=='exists') {
    showalert('PENDING MASIH ADA !!');
  } else {
    settotalpay(objresult.data);
  }
};

//Get Cashier Information
function getinfo(){
  var objinfo = JSON.parse(localStorage.getItem('info'));
  var objuser = JSON.parse(localStorage.getItem('user'));
  cashierid=objinfo.cashierid;
  divshopname.innerHTML =  objinfo.shopname;
 // divusername.innerHTML =  objinfo.cashiername;
 // divcashiername.innerHTML =  objinfo.cashiername;    
  divusername.innerHTML =  objuser.username;
  divusername1.innerHTML =  objuser.username;
  userid=objuser.id;
  useridval=objuser.userid;
};

//get last bill
function getlastbill(){
  intMemberPoint=0;
    var objbill=get_auth_data("/pos/dsales_lastbill",{},false);
    $.each(objbill.data, function (i, item) {
            lastbillno=item.lastbillno;
            divbillno.innerHTML =  item.lastbillno;
            billseqno=item.serialno;
            //$("#memberid").val(item.memberid);
            $("#memberid").val(item.membertext);
            divMemberName.innerHTML=item.membername || 'Non Member';

            divMemberId.innerHTML=item.memberid;
            strMemberId=item.memberid;

            memberPointValue=item.memberpoint;
           // console.log(item.memberid);
    });
    settotalpay(objbill.data);
    gotoscan();
}

//Set Total Pay
function settotalpay(_objdata){
  var divbillno=document.getElementById('divbillno').value;
  $.each(_objdata, function (i, item) {
            totalpay=item.lasttempvalue || 0;
            divtotal.innerHTML=item.lasttempstring;
            divpay.innerHTML=(totalpay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','');

            divdebitpay.innerHTML='<h3>'+item.lasttempstring+'</h3>';
            divDebitPayAfter.innerHTML=(totalpay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','');
            $('#debitamount').val(item.lasttempvalue);
            divcreditpay.innerHTML='<h3>'+item.lasttempstring+'</h3>';

            refundbillno=item.refundbillno;
			getDataPromo(lastbillno);
			// alert(lastbillno);
          });
};

//load pending order
function loadpendingsales(_f1){
    var objpending=get_auth_data("/pos/dsalespending",{ f1:_f1 },false);
    $.each(objpending.data, function (i, item) {
        divbillnopending.innerHTML=item.tempbillno;
       // $('#memberid').val(item.memberid);
    });
};

//Recall pending order
async function recallpendingsales(_f1,_f2,_f3){
    var objrecall=await post_auth_data("/pos/dtempsaleslinerecall",{ f1:_f1,f2:_f2,f3:_f3 },false);
    if (objrecall.result=="success"){
        divbillnopending.innerHTML="";

      //  table.ajax.reload();
        // table.row( ':last').select();
        // table.cell( ':last',":eq(3)" ).focus();
        // table.cell.blur();

        getlastbill();
    } else {
      showalert(objrecall.result);
    }
  
};

objproductdata=get_auth_data("/pos/product",{ f1: '' },false);
var producttable=$('#tableproduct').DataTable( {
      "autoWidth" : true,
	    "processing": true,
      "serverSide": false,
      "lengthChange": false,
      "searching": false,
      "pageLength": 5,
      "info":false,
      "select": true,
      "oTableTools": {
            "sRowSelect": "single"
      },
      keys: true,
      data: objproductdata.data,
        "columns": [
            { "data": "sku" },
            { "data": "name" },
            { "data": "price","className": "text-right" },
            { "data": "stockqty","className": "text-right" },
            
            // { "data": "discountname" },
            // { "data": "pricelast","className": "text-right" },
        ]
});

producttable.on('key-focus', function (e, datatable, cell,originalEvent ) {
  
        datatable.rows().deselect();
        datatable.row( cell.index().row ).select();
		
		getDataPromoSku(lastbillno,datatable.row(cell.index().row).data().sku);

 
     //   var rowData = table.rows( { selected: true } ).data()[0];
});
producttable.on('key', function(e, datatable, key, cell, originalEvent) {
  if (key === 13) {    
              var rowData = producttable.row('.selected').data();
              $('#salesqty').focus();
              strbarcodeselected=rowData.sku;
              producttable.cell.blur();
              $('#salesqty').val("1");
              divalert.innerHTML="Isi Jumlah yang diinginkan ...";
        };
});

var table =$('#tablesales').DataTable( {
      "autoWidth" : true,
	    "processing": true,
      "serverSide": true,
      "lengthChange": false,
      "searching": false,
      "scrollY": 250,
      "paging": true,
      "info":false,
      select: true,
      scroller: true,
      "oTableTools": {
            "sRowSelect": "single"
        },
      keys: true,
     // keys: { columns: [3] },
      "ajax": {
             	"url":api_url+'/pos/table?f1=pos_dtempsalesline_view&f2='+userid,
             	"type": "POST",
						  "dataType": 'json',
						  "contentType": "application/json",
						  "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
						  "data": function(d){
              	d.filter = getsalesfiltervalue();
             // console.log(JSON.stringify(d));
								return (JSON.stringify(d))
								}
				 	},
        "columns": [
            { "data": "seqno" },
            { "data": "sku" },
            { "data": "name" },
            { "data": "qty","className": "text-right" },
            { "data": "price","className": "text-right" },
            { "data": "discount" ,"className": "text-right"},
            { "data": "total" ,"className": "text-right"}
			//{ "data": "discountname" }
        ],
        // "initComplete": function(settings, json){ 
        //   console.log("Processsss");
        //   table.cell( ':last',":eq(3)" ).focus();
        // }
});
table.on('key-focus', function (e, datatable, cell,originalEvent) {
	  // var rowData = datatable.row( cell.index().row ).select();
      datatable.rows().deselect();
      console.log(cell.index().row);
      datatable.row( cell.index().row ).select();

	  getDataPromoSku(lastbillno,datatable.row(cell.index().row).data().sku);
      //console.log(datatable.row(cell.index().row).data().sku);
     //   $('#divcashiername').html( 'Cell in '+rowData[0]+' focused' );

});
table.on('key', async function(e, datatable, key, cell, originalEvent) {
      if (key === 13) {
      
      var rowData = table.row('.selected').data();
       if(voidmode=="") {   
         if ($('#salesqty').val() > 0 && $('#salesqty').val()!='')  { 
           if ($('#salesqty').val() >= 100) {
            if (confirm('Quantity Lebih dari 3 Digit,Apakah Anda Yakin?')) {
                var objresult=await post_auth_data('/pos/dtempsaleslineupdate',{ f1:rowData.id,f2:$('#salesqty').val(),f3:$('#memberid').val(),f4:$('#promoName').val()},false);
                if (objresult.result=='Success'){
                    settotalpay(objresult.data);  
                    checkandShowBuyGet(objresult.data);
                    $('#salesqty').val('1');
                        table.ajax.reload(
                          function() {
                            gotoscan();
                          },false
                        );
                    table.cell.blur();
                } else {
                  showalert(objresult.result);
                };
            };
          } else {
            //Check Qty
             if ($('#salesqty').val() > rowData.qty) {
                var objresult=await post_auth_data('/pos/dtempsaleslineupdate',{ f1:rowData.id,f2:$('#salesqty').val(),f3:$('#memberid').val(),f4:$('#promoName').val()},false);
               // console.log(objresult);
                if (objresult.result=='Success'){
                    settotalpay(objresult.data);  
                    checkandShowBuyGet(objresult.data);
                    $('#salesqty').val('1');
                    table.ajax.reload(
                      function() {
                        gotoscan();
                      },false
                    );
                    table.cell.blur();
                  } else {
                  //  console.log(objresult.result);
                    divalert.innerHTML=objresult.result;
                    showalert(objresult.result);
                };
              } else {
                  //set password
                  openpassword('Qty');
                  activeid=rowData.id;
                  table.cell.blur();
                //  
              };
          };

         } else {

         showalert("QUANTITY TIDAK BOLEH KOSONG ATAU KECIL DARI 0 ! ");
         };
       } else {     
            openpassword('Void');
            activeid=rowData.id;
            table.cell.blur();
           
       }

      } else if (key === 46){
        var rowData = table.row('.selected').data();
        var objresult=await post_auth_data('/pd/dtempsaleslineremove',{ f1: rowData.id,f2:cashierid},false);
        settotalpay(objresult.data);
        table.cell.blur();
        table.ajax.reload(
          function() {
            gotoscan();
          },false
        );      
      }
});

//table.cell( ':last',":eq(3)" ).focus();
//console.log( table.row( ':last', { order: 'seqno' } ).data() );

   
function loadrefund(strsearch) {   
        var refundtable=$('#tablerefund').DataTable( {
          "autoWidth" : true,
          "processing": true,
          "serverSide": true,
          "lengthChange": false,
          "searching": false,
          "pageLength": 5,
          select: true,
          "oTableTools": {
                "sRowSelect": "single"
            },
          keys: true,
          "ajax": {
                "url":api_url+'/pos/table?f1=pos_dsales_refund_view&f2=',
                "type": "POST",
                "dataType": 'json',
                "contentType": "application/json",
                "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
                "data": function(d){
                    d.filter = getrefundfiltervalue();
                    return (JSON.stringify(d))
                        }
                    },
            "columns": [
                { "data": "sku" },
                { "data": "name" },
                { "data": "qty" },
                { "data": "price" },
                { "data": "discount" },
                { "data": "amount" }
            ]
        });
    
        refundtable.on('key-focus', function (e, datatable, cell) {
            datatable.rows().deselect();
            datatable.row( cell.index().row ).select();
            stritemrefundid="";
          });
          refundtable.on('key', function(e, datatable, key, cell, originalEvent) {
            if (key === 13) {            
                  var rowData = refundtable.row('.selected').data();
                  stritemrefundid=rowData.id;
                  intrefundqty=rowData.qty;
                  $('#tablerefund').DataTable().cell.blur();
                  $('#refundqty').focus();
                  //  savetempsales(cashierid,lastbillno,rowData.sku,rowData.qty*-1,rowData.price,rowData.discount);
                  //  $('#tablerefund').DataTable().cell.blur();
                  //  table.ajax.reload();
                  //  refundmod.close();
            } 
          });       
};   

var promotable=$('#tablepromo').DataTable( {
  "sDom": "<'dt-toolbar'<'col-sm-6' <'toolbar'>><'col-sm-12'f>>"+
  "t"+
  "<'dt-toolbar-footer'<'col-sm-2 col-xs-2 hidden-xs'l><'col-xs-12 col-sm-6'p>>",
    "oLanguage": {
    "sSearch": '<span class="input-group-addon"><i class="fa fa-search"></i></span>'
    },	
   // "scrollX": true,
    "autoWidth" : true,
    "processing": true,
    "serverSide": true,
      "ajax": {
               "url":api_url+'/pos/table?f1=pos_mproductdiscount_view&f2=',
               "type": "POST",
              "dataType": 'json',
              "contentType": "application/json",
              "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
               "data": function(d){
                //                     d.filter = getfiltervalue();
                 return (JSON.stringify(d))
                }
           },
    'language': {
    'processing': 'Lagi Loading...'
        } ,
        "columns": [
            { "data": "sku" },
            { "data": "name" },
            { "data": "price","className": "text-right" },
            { "data": "discount","className": "text-right" },
            { "data": "pricediscount","className": "text-right" }
        ]
    });
var promomembertable=$('#tablepromomember').DataTable( {
      "sDom": "<'dt-toolbar'<'col-sm-6' <'toolbar'>><'col-sm-12'f>>"+
      "t"+
      "<'dt-toolbar-footer'<'col-sm-2 col-xs-2 hidden-xs'l><'col-xs-12 col-sm-6'p>>",
        "oLanguage": {
        "sSearch": '<span class="input-group-addon"><i class="fa fa-search"></i></span>'
        },	
       // "scrollX": true,
        "autoWidth" : true,
        "processing": true,
        "serverSide": true,
          "ajax": {
                   "url":api_url+'/pos/table?f1=pos_mproductdiscountmember_view&f2=',
                   "type": "POST",
                  "dataType": 'json',
                  "contentType": "application/json",
                  "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
                   "data": function(d){
                    //                     d.filter = getfiltervalue();
                     return (JSON.stringify(d))
                    }
               },
        'language': {
        'processing': 'Lagi Loading...'
            } ,
            "columns": [
                { "data": "sku" },
                { "data": "name" },
                { "data": "price","className": "text-right" },
                { "data": "pricediscount","className": "text-right" },
                { "data": "maxqty","className": "text-right" }
            ]
    });
 
var promomembertable=$('#tablepromomurah').DataTable( {
      "sDom": "<'dt-toolbar'<'col-sm-6' <'toolbar'>><'col-sm-12'f>>"+
      "t"+
      "<'dt-toolbar-footer'<'col-sm-2 col-xs-2 hidden-xs'l><'col-xs-12 col-sm-6'p>>",
        "oLanguage": {
        "sSearch": '<span class="input-group-addon"><i class="fa fa-search"></i></span>'
        },	
       // "scrollX": true,
        "autoWidth" : true,
        "processing": true,
        "serverSide": true,
          "ajax": {
                   "url":api_url+'/pos/table?f1=pos_mproductdiscountmurah_view&f2=',
                   "type": "POST",
                  "dataType": 'json',
                  "contentType": "application/json",
                  "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
                   "data": function(d){
                    //                     d.filter = getfiltervalue();
                     return (JSON.stringify(d))
                    }
               },
        'language': {
        'processing': 'Lagi Loading...'
            } ,
            "columns": [
                { "data": "sku" },
                { "data": "name" },
                { "data": "price","className": "text-right" },
                { "data": "pricediscount","className": "text-right" },
                { "data": "limitamount","className": "text-right" },
                { "data": "ispromo","className": "text-center" }
            ]
    });

var buygettable=$('#tablebuyget').DataTable( {
      "sDom": "<'dt-toolbar'<'col-sm-6' <'toolbar'>><'col-sm-12'f>>"+
      "t"+
      "<'dt-toolbar-footer'<'col-sm-2 col-xs-2 hidden-xs'l><'col-xs-12 col-sm-6'p>>",
        "oLanguage": {
        "sSearch": '<span class="input-group-addon"><i class="fa fa-search"></i></span>'
        },	
       // "scrollX": true,
        "autoWidth" : true,
        "processing": true,
        "serverSide": true,
          "ajax": {
                   "url":api_url+'/pos/table?f1=pos_dtempbuyget_view&f2=',
                   "type": "POST",
                  "dataType": 'json',
                  "contentType": "application/json",
                  "headers": {"Authorization":localStorage.getItem('token').replace('"','')},
                   "data": function(d){
                    //                     d.filter = getfiltervalue();
                     return (JSON.stringify(d))
                    }
               },
        'language': {
        'processing': 'Lagi Loading...'
            } ,
            "columns": [
                { "data": "skuget" },
                { "data": "product_name" },
                { "data": "price","className": "text-right" },
                { "data": "pricediscount","className": "text-right" }
            ]
    });


function getfiltervalue() { 
   var objfilter = [];
  var arr = {};
   arr.id="txtsearch";
   arr.value=$('#productname').val();
   objfilter.push(arr);
  
   return objfilter;
};
function getsalesfiltervalue() { 
   var objfilter = [];
  var arr = {};
   arr.id="pos_mcashier_key";
   arr.value=cashierid;
   objfilter.push(arr);
  
   return objfilter;
};

function getrefundfiltervalue(){
  var objfilter = [];
  var arr = {};
   arr.id="txtsearch";
   arr.value=$('#refundbillno').val();
   objfilter.push(arr);
  
   return objfilter;
};
//Cash pay change
$("#paygiven").on("change",function() {
 showpaychange("CASH");
});

//Cash Donasi
$("#cashdonasiamount").on("change",function() {
  showpaychange("CASH");
 });
 



//Debit pay change
$("#paycashgiven").on("change",function() {
  showpaychange("DEBIT");
  if (paychange >= 0) {
    buttondebitsubmit.focus();
  } else {
    $("#paycashgiven").focus();
    $("#paycashgiven").select(); 
  };
});

$("#debitdonasiamount").on("change",function() {
    showpaychange("DEBIT");
    buttondebitsubmit.focus();
});


$("#debitamount").focusout(function() {
  showpaychange("DEBIT");
  })
  .blur(function() {
    showpaychange("DEBIT");
});

function showpaychange(strpayment){
     var intReedemPoint=0;
    
   if (strpayment=='DEBIT'){
        if (intMemberPoint > 0) {
          if ($("#usePointDebit").val().replace(/,/g, '') <= intMemberPoint){
            intReedemPoint=$("#reedemPointDebit").val().replace(/,/g, '');
          } else {
          intReedemPoint=intMemberPoint;
          }
        };
        divDebitPayAfter.innerHTML=(totalpay-intReedemPoint).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','');
       
       // $("#debitamount").val(totalpay-intReedemPoint);
        paychange=$("#paycashgiven").val().replace(/,/g, '') - (totalpay-$("#debitamount").val().replace(/,/g, '') - intMemberPoint ); 
        paychange=paychange-$("#debitdonasiamount").val().replace(/,/g, '');
        debitpaycashvalue.innerHTML=(totalpay - intMemberPoint - $("#debitamount").val().replace(/,/g, '')).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','');
        debitpaycashreturn.innerHTML='<h1>'+(paychange).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','')+'</h1>';
        
        if (paychange==0){
          $("#paycashgiven").prop('disabled', true);
        } else {
          $("#paycashgiven").prop('disabled', false);
        };

        if ((totalpay-$("#debitamount").val().replace(/,/g, '')) < 0){
            if ($('#usePointDebit').prop('checked') ) {
              $('#reedemPointDebit').focus();
            } else {
              $("#debitamount").focus();
              $("#debitamount").select();           
            }
            $("#buttondebitsubmit").prop('disabled', true);
        } else {
          $("#buttondebitsubmit").prop('disabled', false);
        };
   } else {

      if (intMemberPoint > 0) {
         if ($("#reedemPointCash").val().replace(/,/g, '') <= intMemberPoint){
           intReedemPoint=$("#reedemPointCash").val().replace(/,/g, '');
         } else {
          intReedemPoint=intMemberPoint;
         }
      };

      divpay.innerHTML= (totalpay-intReedemPoint ).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','');
      paychange=$("#paygiven").val().replace(/,/g, '') - (totalpay - intReedemPoint);
      paychange=paychange-$("#cashdonasiamount").val().replace(/,/g, ''); //Kurangi Donasi
      divpaychange.innerHTML='<h1>'+(paychange).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','')+'</h1>';
      if(paychange <0){
        if ($('#usePoint').prop('checked') ) {
          $('#reedemPointCash').focus();
        } else {
          $("#paygiven").focus();
          $("#paygiven").select(); 
        }
      } else {
        buttoncashsubmit.focus();
      };
   }
};


function formdebitfresh(){
  $('#debitamount').val(totalpay);
  $('#debitcard').val('');
  $('#debitapprovecode').val('');
  debitpaycashvalue.innerHTML='';
  debitpaycashreturn.innerHTML='';
  $('#paycashgiven').val('');
};

$('#paymod').on('close', function(event) {
  boolpaymode=false;
  gotoscan();
});

$('#cashmod').on('close', function(event) {
  gotoscan();
});

$('#debitmod').on('close', function(event) {
  formdebitfresh();
  gotoscan();
});

$('#creditmod').on('close', function(event) {
  gotoscan();
});

$('#refundmod').on('close', function(event) {
  gotoscan();
});
$('#reprintmod').on('close', function(event) {
  gotoscan();
});

$('#passwordmod').on('close', function(event) {
  gotoscan();
});

$('#promooptionmod').on('close', function(event) {
  gotoscan();
});


// Modal first Focus
$('#changemoneymod').on('shown.bs.modal', function () {
  $('#buttonchangemoneysubmit').focus();
});

$('#ultahmod').on('shown.bs.modal', function () {
  $('#btnCloseUltah').focus();
});



// Keyboard Event
window.addEventListener('keydown', async event => {
    if (localStorage.getItem('user') == null) {  
        $('#loginmod').modal('show');
    }
    // if (event.key === 'Escape' || event.keyCode === 27) {
    //     window.close();
    // };
	

	 if (event.keyCode == 35) { //End
		 openPpob();
	 }

    if (event.key === 'F1') {
        console.log("F1 Presss");
        table.cell.blur();
        producttable.cell.blur();

        gotoscan();
    };
    if (event.key === 'F2') {
        console.log("F2 Presss");
        producttable.cell.blur();
         if ( !table.data().count() ) { 
          showalert( 'ITEM BELANJA TIDAK DITEMUKAN !' );       
         } else {
            voidmode="1";
            table.row( ':last').select();
            table.cell( ':last',":eq(3)" ).focus();
           // $('#tablesales').DataTable().row(':eq(3)', { page: 'current' }).select();
            ////  $('#tablesales').DataTable().row( cell.index().row ).select();
           // $('#tablesales').DataTable().cell( ':eq(3)' ).focus();
            divalert.innerHTML="Pilih Item Product yg akan di hapus lalu tekan enter ...";
        };

    };
    if (event.key === 'F3') {
        console.log("F3 Presss");
        producttable.cell.blur();
        if (!table.data().count() ) {   
            reprintbill();    
            if (isDialogSupported) {
              reprintmod.showModal();
            } else {
              reprintmod.setAttribute("open", "");
            };
            divbillpreview.innerHTML="";
            reprintmod.querySelector("input").focus();
        } else {
          showalert('SELESAIKAN DULU TRANSAKSI !!');
        };

    };
    if (event.key === 'F4') {
        console.log("F4 Presss");
        producttable.cell.blur();
        if (!table.data().count() ) {  
          openpassword('Refund');
        } else {
          showalert( 'SELESAIKAN DULU TRANSAKSI !!' );
        }
        

    };
    if (event.key === 'F5') {
        console.log("F5 Presss");
       // if (!table.data().count() ) {
       //   window.location.href =`file:///${__dirname}/promo.html`;
          promotable.cell.blur();
          if (isDialogSupported) {
           promooptionmod.showModal();
          } else {
           promooptionmod.setAttribute("open", "");
          };
      //  } else {
      //    alert( 'TRANSAKSI MASIH ADA !' );
      //  };
    };
    if (event.key === 'F6') {
        console.log("F6 Presss");
        producttable.cell.blur();
        if(confirm("Simpan transaksi sementara?")){
          salespending();
          table.ajax.reload();
          loadpendingsales(cashierid);
          getlastbill();

          }
      else{
          return false;
      }
       
    };
    if (event.key === 'F7') {
        console.log("F7 Presss");
        producttable.cell.blur();
        if (!table.data().count() ) {
          showalert('ITEM BELANJA TIDAK DITEMUKAN !');
        } else {
          if (totalpay>=500) {
            divalert.innerHTML="Pilih Pembayaran ...";
            pointStatus();
            if (isDialogSupported) {
              paymod.showModal();
            } else {
              paymod.setAttribute("open", "");
            };
            btncash.focus();
            boolpaymode=true;
            intup=0;
          } else {
            showalert('TOTAL PEMBELIAN TIDAK BOLEH MINUS!');
          };

        };
        
    };
    if (event.key === 'F8') {
        console.log("F8 Presss");
        producttable.cell.blur();
        if (! table.data().count() ) {
          showalert( 'ITEM BELANJA TIDAK DITEMUKAN !' );
      } else {
        voidmode="";
        f8mode=true;
        divalert.innerHTML="Pilih Item Product dan isi jumlah yg diinginkan.."
        table.row( ':last').select();
        table.cell( ':last',":eq(3)" ).focus();
        $('#salesqty').val('');
        $('#salesqty').focus();
      };
    };

    if (event.key === 'F10') {
        console.log("F10 Presss");
        producttable.cell.blur();
        voidmode="";
        $('#productname').val('');
        $('#productname').focus();
        table.cell.blur();
        divalert.innerHTML="Ketik Nama Item Product atau Barcode ...";
    };
  
    if (event.key === 'F12') {
		//cek transaksi pending
		var status = cekSalesPending(lastbillno);
		if(status == '0'){
			showalert("<font style='color: red'>Selesaikan sales atau pending terlebih dahulu sebelum log out!</font>");
		}else{
				console.log("F12 Presss");
				var objresult= await post_auth_data('/pos/logout',{ f1: cashierid },false);
				if (objresult.success) {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					window.location.href =`file:///${__dirname}/login.html`;
				} else {
					showalert("Log out fail !");
				};
		}
    };
	
    if (event.keyCode == 84 && event.ctrlKey) {
      console.log("t Presss");
      if (! $('#productname').is(':focus')) {     
          if ( ! table.data().count() ) {
            showalert( 'ITEM BELANJA TIDAK DITEMUKAN !' );
          } else {
            if (totalpay>500) {
            opencashpayment();
            } else {
              showalert('TOTAL PEMBELIAN TIDAK BOLEH MINUS!');
            };
          };
        };
     };
     if (event.keyCode == 75 && event.ctrlKey) {
        console.log("k Presss");
        if (! $('#productname').is(':focus')) {
          if ( ! table.data().count() ) {
            showalert( 'ITEM BELANJA TIDAK DITEMUKAN !' );
          } else {
            if (totalpay>500) {
            opencreditpayment();
            } else {
              showalert('TOTAL PEMBELIAN TIDAK BOLEH MINUS!');
            };
          };
        };
    };
    if (event.keyCode == 68 && event.ctrlKey) {
      console.log("d Presss");
      if (!$('#productname').is(':focus')) {
        if (!table.data().count()) {
          showalert( 'ITEM BELANJA TIDAK DITEMUKAN !' );
        } else {
          if (totalpay>=500) {
          opendebitpayment();
          } else {
            showalert('TOTAL PEMBELIAN TIDAK BOLEH MINUS!');
          };
        };
      };
    };

	if (event.shiftKey) {
		// $('#referalstruk').val('');
        $('#referalstruk').focus();
	}
	
	
});

//Keyboard event special key
$(document).on("keydown",function(ev){
//	console.log(ev.keyCode);
	if(ev.keyCode===122) {
    console.log('F11 Pressed');
    if ( !table.data().count() ) {
      recallpendingsales(lastbillno,cashierid,userid);
      table.ajax.reload();
    } else {
      showalert( 'SELESAIKAN DULU TRANSAKSI !!' );
    }
    return false
  };
  if(ev.keyCode===27) {
    $('#changemoneymod').modal('hide');
    promooptionmod.close();
    gotoscan();
  };
  if(ev.keyCode===36) {
     if (!table.data().count() ) {
          window.location.href =`file:///${__dirname}/home.html`;
     } else {
      showalert('TRANSAKSI MASIH ADA !');
     };
  };

  // if (ev.keyCode == 9 && boolcashmode==false ) {  //tab pressed
  //   //objEvent.preventDefault(); // stops its action
  //   return false
  // };

  if (boolpaymode==true && ev.keyCode == 38) {
     intup=intup-1;
     updownpaymode(intup);
   //  console.log(intup);
  };
  if (boolpaymode==true && ev.keyCode == 40) {
    intup=intup+1;
    updownpaymode(intup);
   // console.log(intup);
  };

});

function updownpaymode(intvalue){
  switch(intvalue) {
    case 1:
      // code block
      $('#btncash').focus();
      break;
    case 2:
        $('#btndebit').focus();
      break;
    case 3:
        $('#btncredit').focus();
        break;
    default:
         $('#btnpaymodcancel').focus();
         intup=0;
  }
};

// Pay Cash
const btncash=document.getElementById('btncash');
btncash.addEventListener('click',function (event){
  opencashpayment();
});



const cashsubmit=document.getElementById('buttoncashsubmit');
cashsubmit.addEventListener('click',async function (event){
	
	var referalstruk=$("#referalstruk").val();
	
    if ($("#paygiven").val() !=''){
      if ($("#paygiven").val().replace(/,/g, '') >= totalpay) {

          var objcashresult=await post_auth_data('/pos/dsalescash',{ f1: billseqno.toString(), f2: cashierid, f3: lastbillno, f4: totalpay.toString(),f5:$("#paygiven").val().replace(/,/g, ''),f6:$("#cashdonasiamount").val().replace(/,/g, ''),f7:strMemberId,f8: intMemberPoint.toString() },false);
          if (objcashresult.success) { 
              gentexttoprint(objcashresult.billno);
			  updateReferal(objcashresult.billno, referalstruk);
              cashmod.close();
              getlastbill();
              table.ajax.reload();
              gotoscan();   
			  
			  
			  
          } else {
             showalert(objcashresult.result);
          };
      } else {
        showalert('PEMBAYARAN KURANG DARI TOTAL YG HARUS DI BAYAR !');
      };
    } else {
      showalert('DATA BELUM LENGKAP !');
    }
});


// Pay Debit
const btndebit=document.getElementById('btndebit');
btndebit.addEventListener('click',function (event){
  opendebitpayment();
});

const debitsubmit=document.getElementById('buttondebitsubmit');
debitsubmit.addEventListener('click',async function (event){
    var intpaycashgiven=0;
    var inttotalpay=0;
	
	var referalstruk=$("#referalstruk").val();
	 
	

    if ($("#debitamount").val().replace(/,/g, '')=="") {
      $("#debitamount").focus();
      return false;
    };
    if ($("#paycashgiven").val().replace(/,/g, '')!=""){
      intpaycashgiven=parseInt($("#paycashgiven").val().replace(/,/g, ''));
    };
    inttotalpay=parseInt($("#debitamount").val().replace(/,/g, '')) + intpaycashgiven ;
    if (inttotalpay >= (totalpay-intMemberPoint)){

      if ($("#debitcard").val() !='' && $("#debitapprovecode").val() !=''){
        var objdebitresult=await post_auth_data('/pos/dsalesdebit',{ f1: billseqno, f2: cashierid, f3: lastbillno, f4: totalpay,f5:$("#debitamount").val().replace(/,/g, ''),f6:intpaycashgiven,f7:$('#debitcard').val(),f8:$('#debitapprovecode').val(),f9:$('#edcdebitname').val(),f10:$('#bankdebitname').val(),f11:$("#debitdonasiamount").val().replace(/,/g, ''),f12:strMemberId,f13:intMemberPoint.toString()},false);
          if (objdebitresult.success) {
            gentexttoprint(objdebitresult.billno);
            debitmod.close();
            getlastbill();
            table.ajax.reload();
			updateReferal(objdebitresult.billno, referalstruk);
          } else {
            showalert(objdebitresult.result);
            };
      } else {
        $("#debitcard").focus();
      };
    } else {
    //  showalert('PEMBAYARAN KURANG DARI TOTAL YG HARUS DI BAYAR !' );
      $('#paycashgiven').focus();
    };
});

// Pay Credit
const btncredit=document.getElementById('btncredit');
btncredit.addEventListener('click',function (event){
  opencreditpayment();
});

const creditsubmit=document.getElementById('buttoncreditsubmit');
creditsubmit.addEventListener('click',async function (event){
	
	var referalstruk=$("#referalstruk").val();
	 
	
	
    if ($("#creditcard").val() !='' && $("#creditapprovecode").val() !=''){
    var objcreditresult=await post_auth_data('/pos/dsalescredit',{ f1: billseqno, f2: cashierid, f3: lastbillno, f4: totalpay,f5:$('#creditcard').val(),f6:$('#creditapprovecode').val(),f7:$('#edccreditname').val(),f8:$('#bankcreditname').val(),f9:strMemberId,f10:intMemberPoint.toString()},false);
    if (objcreditresult.success) {
      gentexttoprint(objcreditresult.billno);
      $('#creditmod').modal('hide');
      creditmod.close();
      getlastbill();
      table.ajax.reload();
	  updateReferal(objcreditresult.billno, referalstruk);
    } else {
      const errormessage = document.getElementById('creditmodmessage');
       errormessage.innerHTML =  result.result;
    };
  } else {
    $("#creditcard").focus();
    showalert('DATA BELUM LENGKAP !');
  }

});

//Refund submit
const buttonrefundsubmit=document.getElementById('buttonrefundsubmit');
buttonrefundsubmit.addEventListener('click',function (event){
  loadrefunditem(stritemrefundid,$('#refundqty').val(),$('#usersupervisor').val());
});
// Reprint Bill
const buttonreprintsubmit=document.getElementById('buttonreprintsubmit');
buttonreprintsubmit.addEventListener('click',function (event){ 
  openpassword("Reprint");
});

//Promo Mode
// Promo Option
const btnregulerpromo=document.getElementById('btnregulerpromo');
btnregulerpromo.addEventListener('click',function (event){
  openregulerpromo();
});

const btnmemberpromo=document.getElementById('btnmemberpromo');
btnmemberpromo.addEventListener('click',function (event){
  openmemberpromo();
});


const btnmurahpromo=document.getElementById('btnmurahpromo');
btnmurahpromo.addEventListener('click',function (event){
  openmurahpromo();
});


const btnbuyandget=document.getElementById('btnbuyandget');
btnbuyandget.addEventListener('click',function (event){
  openlistbuyget();
});



function openregulerpromo(){
  promooptionmod.close();

  if (isDialogSupported) {
    promoregulermod.showModal();
   } else {
    promoregulermod.setAttribute("open", "");
   };
  // cashmod.querySelector("input").focus();
};

function openmemberpromo(){
  promooptionmod.close();

  if (isDialogSupported) {
    promomembermod.showModal();
   } else {
    promomembermod.setAttribute("open", "");
   };
  // cashmod.querySelector("input").focus();
};

function openmurahpromo(){
  promooptionmod.close();

  if (isDialogSupported) {
    promomurahmod.showModal();
   } else {
    promomurahmod.setAttribute("open", "");
   };
  // cashmod.querySelector("input").focus();
};

function openlistbuyget(){
  promooptionmod.close();

  if (isDialogSupported) {
    listbuygetmod.showModal();
   } else {
    listbuygetmod.setAttribute("open", "");
   };
  // cashmod.querySelector("input").focus();
};


function openbuyget(){
  let objBuyGet=get_auth_data("/pos/dtempbuygetbybill",{ f1:lastbillno },false);
  let strGet='';
  $.each(objBuyGet.data, function (i, item) {
    strGet += ' Berhak Mendapatkan Hadiah, SKU : '+item.skuget + '<br>(Stock : <b>'+item.stockqty + '</b>)<br> Nama : <font style="color: red">' + item.product_name +'</font> <br>dengan Harga : <font style="color: blue; font-weight: bold">' + item.price_end+'</font><br><br>';
  });
  console.log(strGet);
  if (strGet ==='') {
    showinfo( "Item Gratis sudah masuk di struk" );
  } else {
    showinfo( strGet );
  }
  
};


// close
const buttonpromomodclose=document.getElementById('buttonpromomodclose');
buttonpromomodclose.addEventListener('click',function (event){
  promoregulermod.close();
});

// close
const buttonpromomemberclose=document.getElementById('buttonpromomemberclose');
buttonpromomemberclose.addEventListener('click',function (event){
  promomembermod.close();
});

// close
const buttonpromomurahclose=document.getElementById('buttonpromomurahclose');
buttonpromomurahclose.addEventListener('click',function (event){
  promomurahmod.close();
});

// close Buy and GET
const buttonlistbuygetclose=document.getElementById('buttonlistbuygetclose');
buttonlistbuygetclose.addEventListener('click',function (event){
  listbuygetmod.close();
});



//EDC Select
// var objedc=get_auth_data("/selects/select_filter",{ f3: 'pos_medc_get',f4:'' },false);

var stredcoption='';
var stredcoption_credit='';
   // stredcoption += '<option value=""></option>';
// $.each(objedc.data, function (i,item) {
//         stredcoption += '<option value="' + item.id + '">' + item.text + '</option>';
// });

get_edc_credit();
get_edc_debit();

// console.log(stredcoption);

function get_edc_credit() {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/get_edc.php?jenis=Debit",
    type: "GET",
    success: function (dataResult) {
      // console.log(dataResult);

      var dataResult = JSON.parse(dataResult);
      //looping data
      $.each(dataResult, function (i, item) {
        stredcoption += '<option value="' + item.id + '">' + item.name + '</option>';
      });

      $("#divdebitedc").html(
        '<select id="edcdebitname" class="form-control pull-right" placeholder="EDC" >' +
          stredcoption +
          "</select>"
      );
      
    },
  });
}

function get_edc_debit() {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/get_edc.php?jenis=Credit",
    type: "GET",
    success: function (dataResult) {
      // console.log(dataResult);

      var dataResult = JSON.parse(dataResult);
      //looping data
      $.each(dataResult, function (i, item) {
        stredcoption_credit += '<option value="' + item.id + '">' + item.name + '</option>';
      });

      $("#divcreditedc").html(
        '<select id="edccreditname" class="form-control pull-right" placeholder="EDC" >' +
          stredcoption_credit +
          "</select>"
      );
    },
  });
}




  //Bank Select
var objbank=get_auth_data("/selects/select_filter",{ f3: 'pos_mbank_get',f4:'' },false);
var strbankoption='';
$.each(objbank.data, function (i,item) {
    strbankoption += '<option value="' + item.id + '">' + item.text + '</option>';
});
$('#divdebitbank').html('<select id="bankdebitname" class="form-control pull-right" placeholder="BANK" >'+strbankoption+'</select>' );
$('#divcreditbank').html('<select id="bankcreditname" class="form-control pull-right" placeholder="BANK" >'+strbankoption+'</select>' );

function gotolastrecord(tablename){
  if (tablename.data().count()) { 
  var num_rows = tablename.page.info().recordsTotal;
  tablename.page( 'last' ).draw( false );
  tablename.row( num_rows-1 ).scrollTo();
  };
};
function gotoscan(){
  $('#productbarcode').focus();
 // divalert.innerHTML="Scan Barcode Product ...";
};
//Reprint last transaction
function reprintbill() {
  var objlastrecord=get_auth_data("/pos/dsales_lastrecord",{},false);
  $.each(objlastrecord.data, function (i,item) {
   $('#reprintbillno').val(item.billno);
});
};
async function gentexttoprint(strbillno){
   var strdpp="";
   var strppn="";
   var strnpwp="";
   var strbillamount="";
   var strmemberdiscount="";
   var strgrandamount="";
   var strdcamount="";
   var strpaygiven="";
   var strdonasiamount="";
   var straddressdonasi="";
   var strpayreturn="";
   var strcontent='';
   var strorgdesc='';
   var isppn=0;
   var strTotalDiscount='';
   var strReedemPoint='';
   var strMemberId='';
   var strPointGive='';
   var strMemberName='';
   var strNote1='';
   var strNote2='';
   var strNote3='';
   
   var total = 0;
   var diskon = 0;
   var notes = "";
   var notes_footer = "";
   
   
   sendtoprinter_drawer();
   var objprint=await get_async_auth_data("/pos/dsalesprint",{ f1: strbillno },false);
   $.each(objprint.header, function (i,item) {
	 notes_footer=getDataNotes(item.grandamount);
     strcontent+=textbyline(item.clientname,38,'center')+'\r\n';
     strcontent+=textbyline(item.address1,38,'center')+'\r\n';
     strcontent+=textbyline(item.address2,38,'center')+'\r\n';
     strcontent+=textbyline('STRUK   :'+item.billno,24,'left')+''+textbyline(item.strtime,14,'right')+'\r\n';
     strcontent+=textbyline('TANGGAL :'+item.strdate,18,'left')+''+textbyline(item.postby,20,'right')+'\r\n';
     strdpp=item.dppvalue;
     strppn=item.ppnvalue;
     strnpwp=item.npwp;
     isppn=item.ppn;
     strorgdesc=item.clientdescription;
     strbillamount=item.billamount;
     strmemberdiscount=item.memberdiscount;
     strgrandamount=item.grandamount;
     strdcamount=item.dcamount;
     strpaygiven=item.paygiven;
     strpayreturn=item.payreturn;
     strdonasiamount=item.donasiamount;
     straddressdonasi=item.addressdonasi;
     strTotalDiscount=item.totaldiscount;
     strMemberId=item.membercard;
     strReedemPoint=item.point;
     strPointGive=item.pointgive;
     strMemberName=item.membername;
     strNote1=item.note1,
     strNote2=item.note2,
     strNote3=item.note3
	 
	if(notes_footer != ""){
			// notes+=textbyline("***************************************",38,'center')+'\r\n';
			notes+=wordWrap(notes_footer,38)+'\r\n';
	}
	 
	 
   });
   strcontent+=textbyline("=======================================",38,'center')+'\r\n';
   strcontent+=textbyline("Nama Barang",10,'center')+textbyline("Qty",5,'center')+textbyline("Harga",7,'center')+textbyline("Disc",6,'center')+textbyline("Total",10,'right')+'\r\n';
   strcontent+=textbyline("=======================================",38,'center')+'\r\n';
 
   $.each(objprint.line, function (i,item) {
     strcontent+=textbyline(item.itemname,38,'left')+'\r\n';
    // strcontent+=textbyline(item.qty.toString(),15,'right')+'\r\n';
     strcontent+=textbyline(item.qty.toString(),13,'right')+textbyline(item.price,0,'right')+textbyline(item.discount.toString(),0,'right')+textbyline(item.amount.toString(),0,'right')+'\r\n';
   
	 diskon += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.discount.toString().replace(",", ""));
	 total += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.price.toString().replace(",", ""));
	
   
   });
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    // strcontent+=textbyline("TOTAL",5,'left')+textbyline(strbillamount.toString(),34,'right')+'\r\n'; 
    strcontent+=textbyline("TOTAL",5,'left')+textbyline(formatRupiah(total.toString()),34,'right')+'\r\n'; 
    strcontent+=textbyline("DISKON     ",11,'left')+textbyline(formatRupiah(diskon.toString()),28,'right')+'\r\n';
    // strcontent+=textbyline("DISKON     ",11,'left')+textbyline(strTotalDiscount.toString(),28,'right')+'\r\n';
    if (strReedemPoint !== "          0"){
    strcontent+=textbyline("REEDEM POINT",8,'left')+textbyline(strReedemPoint.toString(),27,'right')+'\r\n';
    };

    strcontent+=textbyline("GRAND TOTAL",11,'left')+textbyline(strgrandamount.toString(),28,'right')+'\r\n';
    strcontent+=textbyline("BAYAR D/C  ",11,'left')+textbyline(strdcamount.toString(),28,'right')+'\r\n';
    strcontent+=textbyline("BAYAR CASH ",11,'left')+textbyline(strpaygiven,28,'right')+'\r\n';
    strcontent+=textbyline("INFAK      ",11,'left')+textbyline(strdonasiamount.toString(),28,'right')+'\r\n';  
    strcontent+=textbyline("KEMBALI    ",11,'left')+textbyline(strpayreturn.toString(),28,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    if (isppn >0){
    strcontent+=textbyline("DPP :"+strdpp,6,'left')+textbyline("PPN :"+strppn,20,'right')+'\r\n';
    strcontent+=textbyline("=======================================",38,'center')+'\r\n';
    if (strMemberId != ''){
      strcontent+=textbyline("SELAMAT ANDA MENDAPATKAN POINT",38,'center')+'\r\n';
      strcontent+=textbyline("MEMBER   ",11,'left')+textbyline(strMemberName.toString(),28,'right')+'\r\n';
      strcontent+=textbyline("POINT    ",11,'left')+textbyline(strPointGive.toString(),28,'right')+'\r\n';
    }
    strcontent+=textbyline("***************************************",38,'center')+'\r\n';
    strcontent+=textbyline("NPWP :"+strnpwp,38,'center')+'\r\n';
    };
    strcontent+=textbyline(strorgdesc,38,'center')+'\r\n';
    strcontent+=textbyline("***************************************",38,'center')+'\r\n';
	if(strNote1 != ""){
		 strcontent+=textbyline(strNote1,38,'center')+'\r\n';
	}
	
	if(strNote2 != ""){
		 strcontent+=textbyline(strNote2,38,'center')+'\r\n';
	}
	
	if(strNote3 != ""){
		 strcontent+=textbyline(strNote3,38,'center')+'\r\n';
	}
	
	if(strNote1 != "" || strNote2 != "" || strNote3 != ""){
		
		strcontent+=textbyline("***************************************",38,'center')+'\r\n';
	}

    
    strcontent+=textbyline(straddressdonasi,38,'center')+'\r\n';
	strcontent+=notes;
	
	if(jenis_printer == "dot"){
			  
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			  
	}


    print(strcontent);
    console.log(strcontent);
    openmoneychange(strpayreturn);
};
function genbillpreview(objheader,objline){
  var strdpp="";
  var strppn="";
  var strnpwp="";
  var strbillno="";
  var strbillamount="";
  var strmemberdiscount="";
  var strgrandamount="";
  var strdcamount="";
  var strpaygiven="";
  var strpayreturn="";
  var strdonasiamount="";
  var straddressdonasi="";

  var strTotalDiscount='';
  var strReedemPoint='';
  var strMemberId='';
  var strPointGive='';
  var strMemberName='';
  var strNote1='';
  var strNote2='';
  var strNote3='';

   var total = 0;
   var diskon = 0;

  var strcontent='';
  var isppn=0;
        $.each(objheader, function (i,item) {
          var getnotes = getDataNotes(item.grandamount);
          strcontent+='<dl><dt class="text-center">'+item.clientname+'</dt>';
          strcontent+='<dt class="text-center">'+item.address1+'</dt>';
          strcontent+='<dt class="text-center">'+item.address2+'</dt>';
          strcontent+='<dt>REPRINT</dt>';
          strcontent+='</dl>';
          strcontent+='<table width="100%">';
          strcontent+='<tr><td>STRUK   :'+item.billno+'</td><td align="right">'+item.strtime+'</td></tr>';
          strcontent+='<tr><td>TANGGAL :'+item.strdate+'</td><td align="right"></td></tr>';
          strcontent+='</table>';
          strbillno=item.billno;
          strdpp=item.dppvalue;
          strppn=item.ppnvalue;
          isppn=item.ppn;
          strnpwp=item.npwp;
          strorgdesc=item.clientdescription;
          strbillamount=item.billamount;
          strmemberdiscount=item.memberdiscount;
          strgrandamount=item.grandamount;
          strdcamount=item.dcamount;
          strpaygiven=item.paygiven;
          strpayreturn=item.payreturn;
          strdonasiamount=item.donasiamount;
          straddressdonasi=item.addressdonasi;

          strTotalDiscount=item.totaldiscount;
          strMemberId=item.membercard;
          strReedemPoint=item.point;
          strPointGive=item.pointgive;
          strMemberName=item.membername;
          strNote1=item.note1,
          strNote2=item.note2,
          strNote3=item.note3


		  console.log(getnotes);

        });


        strcontent+='<table width="100%">';
        strcontent+='=======================================<br>';
        strcontent+='<tr><td><strong>Nama Barang</strong></td><td><strong>Qty</strong></td><td><strong>Harga</strong></td><td><strong>Disc</strong></td><td><strong>Total</strong></td></tr>';
       // strcontent+=htmlbyline("=======================================",38,'center')+'<br>';
      
        $.each(objline, function (i,item) {
          strcontent+='<tr><td colspan="5">'+item.itemname+'</td></tr>';
          // strcontent+=textbyline(item.qty.toString(),15,'right')+'\r\n';
          strcontent+='<tr><td></td><td align="right">'+item.qty.toString()+'</td><td align="right">'+item.price+'</td><td align="right">'+item.discount.toString()+'</td><td align="right">'+item.amount.toString()+'</td></tr>';
		  
		  diskon += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.discount.toString().replace(",", ""));
		  total += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.price.toString().replace(",", ""));

        });
          strcontent+='<tr><td colspan="5">=======================================</td></tr>';
          strcontent+='<tr><td colspan="4">TOTAL</td><td align="right">'+formatRupiah(total.toString())+'</td></tr>';
          strcontent+='<tr><td colspan="4">DISKON</td><td align="right">'+formatRupiah(diskon.toString())+'</td></tr>';
          strcontent+='<tr><td colspan="4">DISC.MEMBER</td><td align="right">'+strmemberdiscount.toString()+'</td></tr>';
          if (strReedemPoint.toString() !== "          0") {
          strcontent+='<tr><td colspan="4">REDEEM POINT</td><td align="right">'+strReedemPoint.toString()+'</td></tr>';
          }
          strcontent+='<tr><td colspan="4">GRAND TOTAL</td><td align="right">'+strgrandamount.toString()+'</td></tr>';
          strcontent+='<tr><td colspan="4">BAYAR D/C</td><td align="right">'+strdcamount.toString()+'</td></tr>';
          strcontent+='<tr><td colspan="4">BAYAR CASH </td><td align="right">'+strpaygiven+'</td></tr>';
          strcontent+='<tr><td colspan="4">INFAK  </td><td align="right">'+strdonasiamount+'</td></tr>';
          strcontent+='<tr><td colspan="4">KEMBALI </td><td align="right">'+strpayreturn.toString()+'</td></tr>';
          strcontent+='<tr><td colspan="5">=======================================</td></tr>';
          if(isppn > 0) {
          strcontent+='<tr><td colspan="3">DPP :'+strdpp+'</td><td align="right">PPN :'+strppn+'</td></tr>';
          };
          strcontent+='<tr><td colspan="5">=======================================</td></tr>';
          if (strMemberId != ''){
            strcontent+='<tr><td colspan="5" align="center">SELAMAT ANDA MENDAPATKAN POINT</td></tr>';
            strcontent+='<tr><td >MEMBER </td><td colspan="4" align="left">'+strMemberName+'</td></tr>';
            strcontent+='<tr><td >POINT </td><td colspan="4" align="left">'+strPointGive+'</td></tr>';
          }

          strcontent+='</table>';
         // strcontent+=htmlbyline("=======================================",38,'center')+'<br>';
         // strcontent+='\r\n';
          strcontent+='<dl><dt class="text-center">***************************************</dt>';
          if(isppn > 0) {
          strcontent+='<dt class="text-center">NPWP :'+strnpwp+'</dt>';
          };
          strcontent+='<dt class="text-center">'+strorgdesc+'</dt>';
          strcontent+='<dt class="text-center">***************************************</dt>';
          strcontent+='<dt class="text-center">'+strNote1+'</dt>';
          strcontent+='<dt class="text-center">'+strNote2+'</dt>';
          strcontent+='<dt class="text-center">'+strNote3+'</dt>';
          strcontent+='<dt class="text-center">***************************************</dt>';
          strcontent+='<dt class="text-center">'+straddressdonasi+'</dt>';
          strcontent+='</dl>';
          
        divbillpreview.innerHTML=strcontent;
};

function gentexttoreprint(objheader,objline){
  var strdpp="";
  var strppn="";
  var strnpwp="";
  var strbillno="";
  var strbillamount="";
  var strmemberdiscount="";
  var strgrandamount="";
  var strdcamount="";
  var strpaygiven="";
  var strpayreturn="";
  var strdonasiamount="";
  var straddressdonasi="";
   var strcontent='';
   var isppn=0;

   var strTotalDiscount='';
   var strReedemPoint='';
   var strMemberId='';
   var strPointGive='';
   var strMemberName='';
   var strNote1='';
   var strNote2='';
   var strNote3='';
  
   var total = 0;
   var diskon = 0;
   
   var notes = "";
   var notes_footer = "";
  
        $.each(objheader, function (i,item) {
		  notes_footer=getDataNotes(item.grandamount);
          strcontent+=textbyline(item.clientname,38,'center')+'\r\n';
          strcontent+=textbyline(item.address1,38,'center')+'\r\n';
          strcontent+=textbyline(item.address2,38,'center')+'\r\n';
          strcontent+=textbyline('REPRINT',38,'left')+'\r\n';
          strcontent+=textbyline('STRUK   :'+item.billno,24,'left')+''+textbyline(item.strtime,14,'right')+'\r\n';
          strcontent+=textbyline('TANGGAL :'+item.strdate,18,'left')+''+textbyline(item.postby,20,'right')+'\r\n';
          strbillno=item.billno;
          strdpp=item.dppvalue;
          strppn=item.ppnvalue;
          strnpwp=item.npwp;
          isppn=item.ppn;
          strorgdesc=item.clientdescription;
          strbillamount=item.billamount;
          strmemberdiscount=item.memberdiscount;
          strgrandamount=item.grandamount;
          strdcamount=item.dcamount;
          strpaygiven=item.paygiven;
          strpayreturn=item.payreturn;
          strdonasiamount=item.donasiamount;
          straddressdonasi=item.addressdonasi;

          strTotalDiscount=item.totaldiscount;
          strMemberId=item.membercard;
          strReedemPoint=item.point;
          strPointGive=item.pointgive;
          strMemberName=item.membername;
          strNote1=item.note1,
          strNote2=item.note2,
          strNote3=item.note3
		  
		if(notes_footer != ""){
			// notes+=textbyline("***************************************",38,'center')+'\r\n';
			//notes+=textbyline(notes_footer,38,'center')+'\r\n';
			notes+=wordWrap(notes_footer,38)+'\r\n';
		}
	 

        });
        strcontent+=textbyline("=======================================",38,'center')+'\r\n';
        strcontent+=textbyline("Nama Barang",10,'center')+textbyline("Qty",5,'center')+textbyline("Harga",7,'center')+textbyline("Disc",6,'center')+textbyline("Total",10,'right')+'\r\n';
        strcontent+=textbyline("=======================================",38,'center')+'\r\n';
      
        $.each(objline, function (i,item) {
          strcontent+=textbyline(item.itemname,38,'left')+'\r\n';
          // strcontent+=textbyline(item.qty.toString(),15,'right')+'\r\n';
          strcontent+=textbyline(item.qty.toString(),14,'right')+textbyline(item.price,0,'right')+textbyline(item.discount.toString(),0,'right')+textbyline(item.amount.toString(),0,'right')+'\r\n';
		
		  diskon += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.discount.toString().replace(",", ""));
		  total += parseInt(item.qty.toString().replace(",", "")) * parseInt(item.price.toString().replace(",", ""));
		
			// total += parseInt(item.qty) * parseInt(item.price);
			
		
		});
			strcontent+=textbyline("=======================================",38,'center')+'\r\n';
			// strcontent+=textbyline("TOTAL",5,'left')+textbyline(strbillamount.toString(),34,'right')+'\r\n'; 
			strcontent+=textbyline("TOTAL",5,'left')+textbyline(formatRupiah(total.toString()),34,'right')+'\r\n'; 
			strcontent+=textbyline("DISKON     ",11,'left')+textbyline(formatRupiah(diskon.toString()),28,'right')+'\r\n';
    // strcontent+=textbyline("DISKON     ",11,'left')+textbyline(strTotalDiscount.toString(),28,'right')+'\r\n';
          if (strReedemPoint !== "          0"){
            strcontent+=textbyline("REEDEM POINT",8,'left')+textbyline(strReedemPoint.toString(),27,'right')+'\r\n';
            };
          strcontent+=textbyline("GRAND TOTAL",11,'left')+textbyline(strgrandamount.toString(),28,'right')+'\r\n';
          strcontent+=textbyline("BAYAR D/C  ",11,'left')+textbyline(strdcamount.toString(),28,'right')+'\r\n';
          strcontent+=textbyline("BAYAR CASH ",11,'left')+textbyline(strpaygiven,28,'right')+'\r\n';
          strcontent+=textbyline("INFAK      ",11,'left')+textbyline(strdonasiamount,28,'right')+'\r\n';
          strcontent+=textbyline("KEMBALI    ",11,'left')+textbyline(strpayreturn.toString(),28,'right')+'\r\n';
          strcontent+=textbyline("=======================================",38,'center')+'\r\n';
          if (isppn >0){
          strcontent+=textbyline("DPP :"+strdpp,6,'left')+textbyline("PPN :"+strppn,20,'right')+'\r\n';
          strcontent+=textbyline("=======================================",38,'center')+'\r\n';
          if (strMemberId != ''){
            strcontent+=textbyline("SELAMAT ANDA MENDAPATKAN POINT",38,'center')+'\r\n';
            strcontent+=textbyline("MEMBER   ",11,'left')+textbyline(strMemberName.toString(),28,'right')+'\r\n';
            strcontent+=textbyline("POINT :  ",11,'left')+textbyline(strPointGive.toString(),28,'right')+'\r\n';
          }
          strcontent+=textbyline("***************************************",38,'center')+'\r\n';
          strcontent+=textbyline("NPWP :"+strnpwp,38,'center')+'\r\n';
          };
          strcontent+=textbyline(strorgdesc,38,'center')+'\r\n';
          strcontent+=textbyline("***************************************",38,'center')+'\r\n';
			if(strNote1 != ""){
				strcontent+=textbyline(strNote1,38,'center')+'\r\n';
			}
			
			if(strNote2 != ""){
				strcontent+=textbyline(strNote2,38,'center')+'\r\n';
			}
			
			if(strNote3 != ""){
				strcontent+=textbyline(strNote3,38,'center')+'\r\n';
			}
			
			if(strNote1 != "" || strNote2 != "" || strNote3 != ""){
				
				strcontent+=textbyline("***************************************",38,'center')+'\r\n';
			}
          strcontent+=textbyline(straddressdonasi,38,'center')+'\r\n';
		  strcontent+=notes;
		  
		  if(jenis_printer == "dot"){
			  
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			strcontent+=textbyline("  ",38,'center')+'\r\n';
			  
		  }
		  
          print(strcontent);
		  console.log(strcontent);
          // sendtoprinter();
};


function openmoneychange(changemoneyvalue){
  divchangemoney.innerHTML='<h1>'+changemoneyvalue+'</h1>';
  $('#changemoneymod').modal('show');
};
function loadrefunditem(_itemid,_qty,_approvedby){
  console.log(_itemid,_qty,_approvedby);
   if (_qty !=""){
        if (_itemid !="") {  
            if (_qty>0 && _qty !="") {
              if (_qty <= intrefundqty) {
              savetempsalesrefund(cashierid,lastbillno,_itemid,_qty,_approvedby);
              $('#tablerefund').DataTable().cell.blur();
              table.ajax.reload();
              refundmod.close();
              } else {
                showalert('QANTITY REFUND HARUS KECIL ATAU SAMA DENGAN AWAL !');
              };
            } else {
              showalert('QANTITY RETURN HARUS LEBIH BESAR DARI 0 !');
            };

        } else {
          showalert('PILIH ITEM YG AKAN DI RETURN !');
        };
    };
};

$("#paygiven").focusin(function() {
  $(this).select(); 
});
$("#cashdonasiamount").focusin(function() {
  $(this).select(); 
});
$("#debitamount").focus(function() { 
  $(this).select(); 
 });
$("#salesqty").focus(function() { 
  $(this).select(); 
 });
$("#productname").focus(function() { 
  $(this).select(); 
  divalert.innerHTML="Ketik Nama Item Product atau Barcode ...";
 });
$("#productbarcode").focus(function() { 
  $(this).select(); 
  divalert.innerHTML="Scan Barcode Product ...";
 });

function opendebitpayment(){
  paymod.close();
  $('#paycashgiven').val('');
  $('#debitcard').val('');
  $('#debitapprovecode').val('');
  $('#debitdonasiamount').val('0');
 // divDebitPointValue.innerHTML=memberPointValue;
  $('#reedemPointDebit').val(memberPointValue);

  if (memberPointValue > 0){
    $("#usePointDebit").prop('disabled',false);
    $("#usePointDebit").focus();
  } else {
    $("#usePointDebit").prop('disabled',true);
  }

 // $('#edcdebitname').val('');
 // $('#bankdebitname').val('');
  if (isDialogSupported) {
    debitmod.showModal();
   } else {
    debitmod.setAttribute("open", "");
   };
  // $("#debitamount").focus();
};


function opencashpayment(){
  paymod.close();
  $('#paygiven').val('');
  $('#cashdonasiamount').val('0');
  divpaychange.innerHTML='';
  //console.log('memberPointValue',memberPointValue);
  $('#reedemPointCash').val(memberPointValue);
  //divCashPointValue.innerHTML=memberPointValue;
  if (memberPointValue > 0){
    $("#usePoint").prop('disabled',false);
  } else {
    $("#usePoint").prop('disabled',true);
  }

  if (isDialogSupported) {
    cashmod.showModal();
   } else {
    cashmod.setAttribute("open", "");
   };
   cashmod.querySelector("input").focus();
};

function opencreditpayment(){
  paymod.close();
  $('#creditcard').val('');
  $('#creditapprovecode').val('');
  $('#reedemPointCredit').val(memberPointValue);

  if (memberPointValue > 0){
    $("#usePointCredit").prop('disabled',false);
    $("#usePointCredit").focus();
  } else {
    $("#usePointCredit").prop('disabled',true);
  }
 // $('#edccreditname').val('');
 // $('#bankcreditname').val('');
    if (isDialogSupported) {
      creditmod.showModal();
     } else {
      creditmod.setAttribute("open", "");
     };
     creditmod.querySelector("input").focus();
};

function openpassword(_strmod){
  $('#usersupervisor').val('');
  $("#genid").val('');
  $("#supervisorpwd").val('');
  $('#passwordalert').html('');
  if (isDialogSupported) {
    passwordmod.showModal();
  } else {
    passwordmod.setAttribute("open", "");
  };
  strmod=_strmod;
  passwordmod.querySelector("input").focus();
};

async function passwordvalidation(){
  var objpassword=get_auth_data("/pos/supervisor",{f1: $("#usersupervisor").val(),f2:$("#genid").val(),f3:$("#supervisorpwd").val() },false);
  if (objpassword.result=="Confirm") {
     
      passwordmod.close();
    if (strmod=="Refund") {
          if (isDialogSupported) {
              refundmod.showModal();
          } else {
              refundmod.setAttribute("open", "");
          };
          strmod="";         
          $('#refundbillno').val('');
          $('#refundqty').val('');
          $('#tablerefund').DataTable().ajax.reload();
          refundmod.querySelector("input").focus();
      } else if (strmod=="Void") {         
          var objresult=await post_auth_data('/pos/dtempsaleslineremove',{ f1: activeid,f2:cashierid,f3:$("#usersupervisor").val()},false);
		  
			if (objresult.result=='success'){
                settotalpay(objresult.data);
				voidmode="";
				table.cell.blur();
				table.ajax.reload(
				function() {
						gotoscan();
					},false
				);
				strmod="";
            } else {
                showalert(objresult.result);
			};
      } else if (strmod=="Reprint") {
            var objprint=get_auth_data("/pos/dsalesprint",{ f1: $("#reprintbillno").val() },false);
            if (objprint.result=="success") {
              
                gentexttoreprint(objprint.header,objprint.line);
                var objresult=await post_auth_data('/pos/dsalesreprintcount',{ f1: $("#reprintbillno").val() },false);
                reprintmod.close();
            } else {
              showalert(objprint.result);
            }
      } else if (strmod=="Qty"){
            var objresult=await post_auth_data('/pos/dtempsaleslineupdate2',{ f1: activeid,f2:$('#salesqty').val(),f3:$("#usersupervisor").val()},false);
            if (objresult.result=='success'){
                settotalpay(objresult.data);  
                $('#salesqty').val('1');
                table.ajax.reload(
                  function() {
                    gotoscan();
                  },false
                );
                table.cell.blur();
              } else {
                showalert(objresult.result);
			  };
      }

  } else {
    $('#passwordalert').html(objpassword.result);
   // showalert(objpassword.result);
   //  alert(objpassword.result);
  }
};

$('#usersupervisor').select2({
  dropdownParent: $('#passwordmod'),
  ajax:
    {
        url: api_url+'/selects/select_filter?f3=pos_supervisor_user_get',
        data: function (params, page) {
          return {
               // f4: params.term, // search term
              f4: useridval, // search term
              //f4: 'BN', // search term
              // f4: 'BN', // search term
              //f3: 'BN', // search term
              page_limit: 10
              };
			  
			  //alert(params.term);
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

$('#usersupervisor').on('select2:select', function (e) {
  var now = new Date();
// console.log(now.getMinutes());
 var intcode=parseInt(now.getDay()+''+now.getSeconds())*3;
  $("#genid").val(intcode);
  $("#supervisorpwd").focus();
});

//buttonpasswordsubmit
const buttonpasswordsubmit=document.getElementById('buttonpasswordsubmit');
buttonpasswordsubmit.addEventListener('click',async function (event){
  passwordvalidation();
});

const buttonchangemoneysubmit=document.getElementById('buttonchangemoneysubmit');
buttonchangemoneysubmit.addEventListener('click',function (event){
  $('#changemoneymod').modal('hide');
  gotoscan();
});

const btnCloseUltah=document.getElementById('btnCloseUltah');
btnCloseUltah.addEventListener('click',function (event){
  $('#ultahmod').modal('hide');
  gotoscan();
});


async function memberrefresh(strmemberid){
  var objresult=await post_auth_data('/pos/dtempsaleslinememberrefresh',{ f1: $('#memberid').val(),f2: $('#promoName').val()},false);
    if (objresult.result=='Success') {
        settotalpay(objresult.data);
    } else {
      showalert('ERROR !!');
    };
   //Member Info
   var objMember=await get_auth_data('/pos/mmember',{ f1: $('#memberid').val()},false);
    if (objMember.data){

      divMemberName.innerHTML =  objMember.data[0].name;
      divMemberId.innerHTML=objMember.data[0].memberid;
      memberPointValue=objMember.data[0].point;
      strMemberId=objMember.data[0].memberid;
      intUltah=objMember.data[0].ultah;
      divUltah.innerHTML='<h1>'+intUltah.toString()+'</h1>';
      if (intUltah > 0) {
        $('#ultahmod').modal('show');
      };

    } else {
      divMemberName.innerHTML =  'Non Member';
      divMemberId.innerHTML='';
      memberPointValue=0;
      strMemberId='';
    }
 

    table.ajax.reload(
      function() {
        gotoscan();
      },false
    );
};

$('#memberid').blur(async function() {
  memberrefresh($('#memberid').val());

});

//supervisorpwd
$('#memberid').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    memberrefresh($('#memberid').val());
  };
});


$('#promoName').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    gotoscan();
  };
});


$('#alertmode').on('shown.bs.modal', function () {
  $('#buttonclosealert').focus();
});

$('#infomode').on('shown.bs.modal', function () {
  $('#buttoncloseinfo').focus();
});

function showalert(strmessage){
  $('#alertmode').modal('show');
  divmessage.innerHTML=strmessage;
};

function showinfo(strmessage){
  $('#infomode').modal('show');
  divinfomessage.innerHTML=strmessage;
};

const buttonclosealert=document.getElementById('buttonclosealert');
buttonclosealert.addEventListener('click',function (event){
  $('#alertmode').modal('hide');
});

const buttoncloseinfo=document.getElementById('buttoncloseinfo');
buttoncloseinfo.addEventListener('click',function (event){
  $('#infomode').modal('hide');
});


function changeCashEvent(){
  intMemberPoint=0;
  if ($('#usePoint').prop('checked') ) {
    $("#reedemPointCash").prop('disabled',false);
    intMemberPoint=$('#reedemPointCash').val().replace(/,/g, '');
    $('#reedemPointCash').focus();
 } else {
   $("#reedemPointCash").prop('disabled',true);
 };
    showpaychange("CASH");
}

$('#usePoint').change(function() {
  changeCashEvent();

});

 $("#reedemPointCash").on("input", function(){
  // Print entered value in a div box
 // alert('Reedem Point OK !'+ $(this).val().replace(/,/g, '') +' XXX'+memberPointValue);
  if ($(this).val().replace(/,/g, '') > memberPointValue){
     // alert('Reedem Point Tidak Boleh Lebih dari Member Point !'+ memberPointValue);
     $("#reedemPointCash").val(memberPointValue);
  };
  changeCashEvent();

  $(this).focus();
  //$("#result").text($(this).val());
 
});



function changeDebitEvent(){
  intMemberPoint=0;
  if ($('#usePointDebit').prop('checked') ) {
    $("#reedemPointDebit").prop('disabled',false);
    intMemberPoint=$('#reedemPointDebit').val().replace(/,/g, '');
    $("#reedemPointDebit").focus();
  } else {
    $("#reedemPointDebit").prop('disabled',true);
  };

  $("#debitamount").val((totalpay-($("#reedemPointDebit").val())).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','') );

  showpaychange("DEBIT");
};


$('#usePointDebit').change(function() {
  changeDebitEvent();
 });

 $("#reedemPointDebit").on("input", function(){
  if ($(this).val().replace(/,/g, '') > memberPointValue){
     // alert('Reedem Point Tidak Boleh Lebih dari Member Point !'+ memberPointValue);
     $("#reedemPointDebit").val(memberPointValue);
  };

  
  changeDebitEvent();
  $(this).focus();
});


function changeCreditEvent(){
  intMemberPoint=0;
  if ($('#usePointCredit').prop('checked') ) {
    $("#reedemPointCredit").prop('disabled',false);
    intMemberPoint=$('#reedemPointCredit').val().replace(/,/g, '');
    $("#reedemPointCredit").focus();
  } else {
    $("#reedemPointCredit").prop('disabled',true);

  };
 // showpaychange("DEBIT");
 var creditAmount=totalpay - intMemberPoint;
 divcreditpay.innerHTML='<h3> Rp. '+creditAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00','')+'</h3>';
};


$('#usePointCredit').change(function() {
  changeCreditEvent();
 });

 $("#reedemPointCredit").on("input", function(){
  if ($(this).val().replace(/,/g, '') > memberPointValue){
     // alert('Reedem Point Tidak Boleh Lebih dari Member Point !'+ memberPointValue);
     $("#reedemPointCredit").val(memberPointValue);
  };
  changeCreditEvent();
  $(this).focus();
});


// async function getMember(strMemberId){
//   var objresult=await get_auth_data('/pos/mmember',{ f1: strMemberId},false);
//   console.log('getMember',strMemberId,objresult);
// }


function updateReferal(billno, referal){
		 // alert(billno+" | "+referal);
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/action.php?modul=referal&act=update",
				type: "POST",
				data: {
					billno 	: billno, 			
					referal : referal, 			
				},
				cache: false,
				success: function(dataResult){
					console.log(dataResult);
					console.log("http://"+api_storeapps+"/pi/api/action.php?modul=referal&act=update");	
					$("#referalstruk").val("");
					
				}
		});

}


function getNamaHris(ele) {
    if(event.key === 'Enter') {
        // alert(ele.value);  
		getDataHrisByNik(ele.value);
		// gotoscan();
    }
}


function getDataHrisByNik(nik){
		// alert(nik);
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/action.php?modul=referal&act=data_hris_nik&nik="+nik,
				type: "GET",
				success: function(dataResult){
					// console.log("http://"+api_storeapps+"/pi/api/action.php?modul=referal&act=data_hris_nik&nik="+nik);
					if(dataResult == ""){
						$("#referalstruk").val('');
						$("#namapic").html('-');
					}else{
						$("#namapic").html(dataResult);
					}
					// console.log(dataResult);
					
					gotoscan();
				}
		});

}


function getDataNotes(nominal){
	
		var nominal = nominal.replace(/\s/g, '');
		var nominal = nominal.replace(',', '');
		
		var notes = "";
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/cek_notes_go.php?nominal="+nominal,
				type: "GET",
				async: false,
				success: function(dataResult){
					
					notes = dataResult;
					// console.log("http://"+api_storeapps+"/pi/api/cek_notes_go.php?nominal="+nominal);
					// console.log(dataResult);

					// $("#namapic").html(dataResult);
					// gotoscan();
				}
		});
		
		return notes;
}

function getDataPromo(billno){
		// alert(billno);
		var notes = "";
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/cek_promo_active.php?billno="+billno,
				type: "GET",
				async: false,
				success: function(dataResult){
					console.log(dataResult);
					$("#divalertinfo").html(dataResult);
					notes = dataResult;
					// console.log("http://"+api_storeapps+"/pi/api/cek_notes_go.php?nominal="+nominal);
					// console.log(dataResult);

					// $("#namapic").html(dataResult);
					// gotoscan();
				}
		});
		
		return notes;
}


function getDataPromoSku(billno,sku){
		// alert(billno);
		var notes = "";
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/cek_promo_active_sku.php?billno="+billno+"&sku="+sku,
				type: "GET",
				async: false,
				success: function(dataResult){
					console.log(dataResult);
					$("#divalertinfo").html(dataResult);
					notes = dataResult;
					// console.log("http://"+api_storeapps+"/pi/api/cek_notes_go.php?nominal="+nominal);
					// console.log(dataResult);

					// $("#namapic").html(dataResult);
					// gotoscan();
				}
		});
		
		return notes;
}

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


function cekSalesPending(billno){
		// alert(billno);
		var notes = "1";
		$.ajax({
				url: "http://"+api_storeapps+"/pi/api/cek_sales_pending.php?billno="+billno,
				type: "GET",
				async: false,
				success: function(dataResult){
					notes = dataResult;
				}
		});
		
		return notes;
}

// function getDataHris(){

		// $.ajax({
				// url: "http://"+api_storeapps+"/pi/api/action.php?modul=referal&act=data_hris",
				// type: "GET",
				// success: function(dataResult){
					
					// var dataResult = JSON.parse(dataResult);
					// var html = "<option value=''> Pilih Referal</option>";
					// for (let index = 0; index < dataResult.header.length; ++index) {
						
						// html += "<option value='"+dataResult.header[index].nik+"'> "+dataResult.header[index].nama+"</option>";
						
					// }
					
					// $("#referalstruk").html(html);
					
				// }
		// });

// }