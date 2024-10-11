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

