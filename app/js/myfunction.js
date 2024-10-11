require("jquery");
require("popper.js");
require("bootstrap");
var $ = require("jquery");
const Store = require("electron-store");
const electron = require("electron");
const { BrowserWindow, dialog } = require("electron").remote;
const fs = require("fs");
const os = require("os");
const path = require("path");
const ipcRenderer = require("electron").ipcRenderer;
const is = require("electron-is");
//const printer = require('electron-print');

const store = new Store();
const api_url = store.get("api");
const api_storeapps = store.get("api_storeapps");
const ip_printer = store.get("ip_printer");
const ip_server = store.get("ip_server");
const jenis_printer = store.get("jenis_printer");
const print_path = store.get("print_path");
const has = store.get("mac");

const domain = store.get("domain");
const locationid = store.get("locationid");

var jQuery = require("jquery");
// var dt = require('datatables.net')();
var dt = require("datatables.net")(window, $);
//require( 'datatables.net-dt' )();
//require( 'datatables.net-keytable' )();
//require( 'datatables.net-select' )();
var msk = require("jquery-mask-plugin");

function get_data(_api, _param, _async) {
  var strres = $.ajax({
    url: api_url + _api,
    type: "GET",
    global: false,
    data: _param,
    dataType: "json",
    async: _async,
    beforeSend: function () {
      $("#loader").html(
        "<img src='./img/loading.gif' width='100px' height='100px'>"
      );
    },
    success: function (res) {},
    error: function (res) {},
    complete: function (data) {
      // Hide image container
      //  $("#loader").hide();
    },
  }).responseText;
  return $.parseJSON(strres);
}
function get_auth_data(_api, _param, _async) {
  var strres = $.ajax({
    url: api_url + _api,
    type: "GET",
    global: false,
    data: _param,
    headers: { Authorization: localStorage.getItem("token").replace('"', "") },
    dataType: "json",
    async: _async,
    success: function (res) {},
    error: function (res) {
      if (res.status == 401) {
        // window.location.href="lock.html";
        console.log("get_Auth_data -- Not Authorize " + api_url + _api);
      }
      //     if (res.status==500)
      //     {
      //   //      window.location.href="error500.html";
      //     }
      //     if (res.status==404)
      //     {
      //   //      window.location.href="error404.html";
      //     }
    },
  }).responseText;
  return $.parseJSON(strres);
}

function post_data(_api, _param, _async) {
  var strres = $.ajax({
    type: "POST",
    url: api_url + _api,
    data: JSON.stringify(_param),
    contentType: "application/json",
    dataType: "json",
    async: _async,
    success: function (response) {},
    error: function (res) {},
  }).responseText;
  return $.parseJSON(strres);
}

async function post_async_auth_data(_api, _param, _async) {
  let result;

  try {
    result = await $.ajax({
      url: api_url + _api,
      type: "POST",
      data: JSON.stringify(_param),
      contentType: "application/json",
      dataType: "json",
      headers: {
        Authorization: localStorage.getItem("token").replace('"', ""),
      },
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function get_async_auth_data(_api, _param, _async) {
  let result;
  try {
    result = await $.ajax({
      url: api_url + _api,
      type: "GET",
      data: _param,
      contentType: "application/json",
      dataType: "json",
      headers: {
        Authorization: localStorage.getItem("token").replace('"', ""),
      },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function post_auth_data(_api, _param, _async) {
  var strres = await $.ajax({
    type: "POST",
    url: api_url + _api,
    data: JSON.stringify(_param),
    contentType: "application/json",
    dataType: "json",
    async: _async,
    headers: { Authorization: localStorage.getItem("token").replace('"', "") },
    beforeSend: function () {
      //  $("#loaderpos").show();
      //  $('#loaderpos').html("<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />");
    },
    success: function (response) {},
    error: function (res) {},
    complete: function (data) {
      // Hide image container
      //  $("#loaderpos").hide();
    },
  }).responseText;
  return $.parseJSON(strres);
}

// function post_sync(_api,_param,_async){
//   var strres= $.ajax({
//       type: "POST",
//       url: api_sync+_api,
//       data: JSON.stringify(_param),
//       contentType: "application/json",
//       dataType: "json",
//       async: _async,
//       success: function (response) { },
//       error:function(res){}
//   }).responseText;
//   return $.parseJSON(strres);

// };

//Function Sync
// function get_infinite(_api,_param,_async){
//   var strres= $.ajax({
//       url: api_infinite+_api,
//       type: "GET",
//       global: false,
//       data: _param,
//       dataType: "json",
//       async: _async,
//       beforeSend: function(){
//           $('#loaderpos').html("<img src='./img/loading.gif' width='100px' height='100px'>");
//       },
//       success: function (res) {
//       },
//       error:function(res) {
//       },
//       complete:function(data){
//           // Hide image container
//           $("#loaderpos").hide();
//          }

//   }).responseText;
//   return $.parseJSON(strres);
// };

// function
function writefile(strtext) {
    
    //fs.writeFile(path.join(__dirname, "../../../print.txt"), strtext, (err) => {
    // fs.writeFile(path.join(__dirname,'../print.txt'), strtext, (err) => {
    // fs.writeFile(path.join(__dirname,'../print.txt'), strtext, (err) => {
    fs.writeFile(path.join(print_path,'/pos/print.txt'), strtext, (err) => {
    if (err) {
      alert("An error ocurred updating the file" + err.message);
    }
  });

  // alert(path.join(__dirname,'../../../print.txt'));
}

function print(strtext) {
  console.log(strtext);

  const myArray = ip_server.split(":"); //ngebaca server store apps
  let ip_server_fix = myArray[0];

  if (jenis_printer == "thermal") { //windows
    $.ajax({
      url: "http://" + ip_printer + "/pi/print_struk.php", //http://localhost/pi/print_struk.php
      type: "POST",
      data: {
        html: strtext,
        ip_printer: ip_printer,
      },
      success: function (dataResult) {},
    });
  } else if (jenis_printer == "vsc") { //windows
    $.ajax({
      url: "http://" + ip_printer + "/pi/print_struk_vsc.php", //http://localhost/pi/print_struk.php
      type: "POST",
      data: {
        html: strtext,
        ip_printer: ip_printer,
      },
      success: function (dataResult) {
        // var dataResult = JSON.parse(dataResult);
        // $('#notif').html("Proses print");
      },
    });
  } else if (jenis_printer == "vsc_linux") { //linux
    $.ajax({
      url: "http://" + ip_printer + "/pi/print_struk_vsc_linux.php", //http://localhost/pi/print_struk.php
      type: "POST",
      data: {
        html: strtext,
        ip_printer: ip_printer,
      },
      success: function (dataResult) {
        // var dataResult = JSON.parse(dataResult);
        // $('#notif').html("Proses print");
      },
    });
  } else {
    const process = require("child_process"); // The power of Node.JS
    var cmd = "";
    if (is.windows()) {
      // writefile(strtext);
      var perintah = "notepad /p print.txt";
      var writeStream = fs.createWriteStream("print.txt");
      writeStream.write(strtext);
      writeStream.end();

      // cmd = "print.bat";
      cmd = perintah;
    } else {
      cmd = 'echo "' + strtext + '" | lpr -o raw';
    }
    var child = process.exec(cmd);
    child.on("error", function (err) {
      console.log("stderr: <" + err + ">");
    });

    child.stdout.on("data", function (data) {
      console.log(data);
    });

    child.stderr.on("data", function (data) {
      console.log("stderr: <" + data + ">");
    });

    child.on("close", function (code) {
      if (code == 0) console.log("child process complete.");
      else console.log("child process exited with code " + code);
    });
  }
}

function formatRupiah(bilangan) {
  var number_string = bilangan.toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{1,3}/gi);

  if (ribuan) {
    separator = sisa ? "," : "";
    rupiah += separator + ribuan.join(".");
  }
  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return rupiah;
}

function printworker(strtext) {
  // send whatever you like

  ipcRenderer.send("printPDF", strtext);
}

function wordWrap(str, maxWidth) {
  var newLineStr = "\r\n";
  done = false;
  res = "";
  do {
    found = false;
    // Inserts new line at first whitespace of the line
    for (i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join("");
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join("");
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth) done = true;
  } while (!done);

  return res + str;
}
function testWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

function textbyline(str, intmax, stralign) {
  var strresult = "";
  if (stralign == "right") {
    strresult = str.padStart(intmax);
    // strresult=str;
  } else if (stralign == "center") {
    var l = str.length;
    var w2 = Math.floor(intmax / 2);
    var l2 = Math.floor(l / 2);
    var s = new Array(w2 - l2 + 1).join(" ");
    str = s + str + s;
    if (str.length < intmax) {
      str += new Array(intmax - str.length + 1).join(" ");
    }
    strresult = str;
  } else {
    strresult = str;
  }
  return strresult;
}

function addspace(strtext, intmax) {
  if (strtext.length < intmax) {
    var tot = intmax - strtext.length;
    for (i = 0; i < tot; i++) {
      strtext = strtext + " ";
    }
  }
  return strtext;
}

// function sendtoprinter(){
// const process = require('child_process');   // The power of Node.JS

// var cmd = (is.windows()) ? 'print.bat' : print_path+'/pos/print.sh';
// var child = process.spawn(cmd);

// child.on('error', function(err) {
// console.log('stderr: <'+err+'>' );
// });

// child.stdout.on('data', function (data) {
// console.log(data);
// });

// child.stderr.on('data', function (data) {
// console.log('stderr: <'+data+'>' );
// });

// child.on('close', function (code) {
// if (code == 0)
// console.log('child process complete.');
// else
// console.log('child process exited with code ' + code);

// });
// };

function sendtoprinter_drawer() {
  // const process = require('child_process');   // The power of Node.JS
  // var cmd = (is.windows()) ? 'printdrawer.bat' : print_path+'/pos/opendrawer.sh';
  // var child = process.spawn(cmd);
  // child.on('error', function(err) {
  // console.log('stderr: <'+err+'>' );
  // });
  // child.stdout.on('data', function (data) {
  // console.log(data);
  // });
  // child.stderr.on('data', function (data) {
  // console.log('stderr: <'+data+'>' );
  // });
  // child.on('close', function (code) {
  // if (code == 0)
  // console.log('child process complete.');
  // else
  // console.log('child process exited with code ' + code);
  // });
}
function enableTabbingOnModal(tabbableElements) {
  $.each(tabbableElements, function (index, element) {
    if ($(element).parents(".modal").length) {
      //element is inside of the modal
      $(element).attr("tabindex", "0");
    }
  });
}

function disableTabbingOnPage(tabbableElements) {
  $.each(tabbableElements, function (index, element) {
    $(element).attr("tabindex", "-1");
  });
}

function showalert(strtitle, strmessage) {
  // $.SmartMessageBox({
  //   title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
  //   content : "You can improve your security further after logging out by closing this opened browser",
  //   buttons : '[No][Yes]'

  // }, function(ButtonPressed) {
  //   if (ButtonPressed == "Yes") {
  //     // localStorage.removeItem('token');
  //     // localStorage.removeItem('menu');
  //     // localStorage.removeItem('user');
  //     // $.root_.addClass('animated fadeOutUp');
  //     // setTimeout(logout, 1000);
  //   }
  // });
  $.SmartMessageBox({
    title: strtitle,
    content: strmessage,
    buttons: "[Close]",
    ActiveButton: "[Close]",
  });
  $("#bot1-Msg1").focus();
}

function showerror(strmessage) {
  // dialog.showMessageBox(strmessage);
  //  dialog.showErrorBox('Ada Kesalahan !', strmessage);
  dialog.showMessageBox(
    // new BrowserWindow({
    //   show: false,
    //   alwaysOnTop: true
    // }),
    null,
    {
      type: "error",
      message: strmessage,
    }
  );
}


var cashierid = "";
var ad_org_id = "";
var userid = "";
var useridval = "";
var strsalesdate = "";
// var ip_local = "http://10.0.106.2";
var ip_local = "http://localhost";

//function with loading spinner

function syncSalesHeader() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_header.php?date=" + date;
  $.get(url, function (data, status) {
    // console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesLine() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_line.php?date=" + date;
  $.get(url, function (data, status) {
    // console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesCashierBalance() {
  var date = $("#date").val();
  var url =
    ip_local + "/pi/api/cyber/sync_sales_cashierbalance.php?date=" + date;
  $.get(url, function (data, status) {
    // console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesDeleted() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_deleted.php?date=" + date;
  $.get(url, function (data, status) {
    // console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}

function syncSalesShopSales() {
  var date = $("#date").val();
  var url = ip_local + "/pi/api/cyber/sync_sales_shopsales.php?date=" + date;
  $.get(url, function (data, status) {
    // console.log(data);
    // alert("Proses sync, klik tombol refresh setelah beberapa saat..");
  });
}



function syncSalesAuto() {
  syncSalesHeader();
  syncSalesLine();
  syncSalesCashierBalance();
  syncSalesDeleted();
  syncSalesShopSales();
  console.log("sync success");
  // alert("sync success");
}

setInterval(syncSalesAuto, 30000);

function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('menu');
  localStorage.removeItem('user');
  window.location.href = "login.html";
}

setInterval(logout, 600000);