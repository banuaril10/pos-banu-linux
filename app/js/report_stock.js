require("jquery");
require("popper.js");
require("bootstrap");
var $ = require("jquery");

// get cashier information
$("#loaderpos").html(
  "<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />"
);
getinfo();
$("#loaderpos").hide();

function getinfo() {
  var objinfo = JSON.parse(localStorage.getItem("info"));
  divshopname.innerHTML = objinfo.shopname;
}

var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}

// log out
const btnback = document.getElementById("btnback");
btnback.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/report.html`;
});

const btnsalesdaily = document.getElementById("btnsalesdaily");
const btnsalesbycashier = document.getElementById("btnsalesbycashier");
const btnsalesvoid = document.getElementById("btnsalesvoid");
const btnsalesnoncash = document.getElementById("btnsalesnoncash");
const btnsalestoday = document.getElementById("btnsalestoday");
const btnexportexcel = document.getElementById("btnexportexcel");

function hide_all() {
  //reset datatable
  $("#tablesalesdaily").DataTable().destroy();
  $("#tablesalesbycashier").DataTable().destroy();
  $("#tablesalesvoid").DataTable().destroy();
  $("#tablesalesnoncash").DataTable().destroy();
  $("#tablesalestoday").DataTable().destroy();

  $("#tablesalesdaily").hide();
  $("#tablesalesbycashier").hide();
  $("#tablesalesvoid").hide();
  $("#tablesalesnoncash").hide();
  $("#tablesalestoday").hide();
}

btnsalesdaily.addEventListener("click", async function (event) {
  hide_all();
  get_report_sales_daily();
});

btnsalesbycashier.addEventListener("click", async function (event) {
  hide_all();
  get_report_sales_by_cashier();
});

btnsalesvoid.addEventListener("click", async function (event) {
  hide_all();
  get_report_sales_void();
});

btnsalesnoncash.addEventListener("click", async function (event) {
  hide_all();
  get_report_sales_non_cash();
});

btnsalestoday.addEventListener("click", async function (event) {
  hide_all();
  get_report_sales_today();
});

btnexportexcel.addEventListener("click", async function (event) {
  var jenis_laporan = $("#jenis_laporan").val();
  var title_report = $("#title_report").html();
  var table = "";
  var data = "";
  var dataexcel = [];

  if (jenis_laporan == "get_report_sales_by_cashier") {
    data = get_excel_sales_by_cashier();
    var row_title = [];
    row_title.push("No");
    row_title.push("Start Date");
    row_title.push("Close Date");
    row_title.push("Cashier Name");
    row_title.push("Balance");
    row_title.push("Sales");
    row_title.push("Discount");
    row_title.push("Refund");
    row_title.push("Net Sales");
    row_title.push("Sales Non Cash");
    row_title.push("Cash In Sistem");
    row_title.push("Cash In Drawer");
    row_title.push("Variant");
    row_title.push("Infaq");
    row_title.push("Status");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].no);
      row.push(data[i].start_date);
      row.push(data[i].close_date);
      row.push(data[i].cashier_name);
      row.push(data[i].balance_1);
      row.push(data[i].sales_1);
      row.push(data[i].discount_1);
      row.push(data[i].refund_1);
      row.push(data[i].net_sales_1);
      row.push(data[i].sales_non_cash_1);
      row.push(data[i].cash_in_sistem_1);
      row.push(data[i].cash_in_drawer_1);
      row.push(data[i].variant_1);
      row.push(data[i].infaq_1);
      row.push(data[i].status);
      dataexcel.push(row);
    }
  } else if (jenis_laporan == "get_report_sales_daily") {
    data = get_excel_sales_daily();
    var row_title = [];
    row_title.push("No");
    row_title.push("Sales Date");
    row_title.push("Sales");
    row_title.push("Discount");
    row_title.push("Refund");
    row_title.push("Net Sales");
    row_title.push("Sales Non Cash");
    row_title.push("Cash In Sistem");
    row_title.push("Cash In Drawer");
    row_title.push("Variant");
    row_title.push("Infaq");
    row_title.push("Remark");
    row_title.push("Closed By");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].no);
      row.push(data[i].sales_date);
      row.push(data[i].sales);
      row.push(data[i].discount);
      row.push(data[i].refund);
      row.push(data[i].net_sales);
      row.push(data[i].sales_non_cash);
      row.push(data[i].cash_in_sistem);
      row.push(data[i].cash_in_drawer);
      row.push(data[i].variant);
      row.push(data[i].infaq);
      row.push(data[i].remark);
      row.push(data[i].closed_by);
      dataexcel.push(row);
    }
  } else if (jenis_laporan == "get_report_sales_void") {
    data = get_excel_sales_void();
    var row_title = [];
    row_title.push("No");
    row_title.push("Insert Date");
    row_title.push("SKU");
    row_title.push("Description");
    row_title.push("Qty");
    row_title.push("Price");
    row_title.push("Discount");
    row_title.push("Total");
    row_title.push("Approved By");
    row_title.push("Cashier Name");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].no);
      row.push(data[i].insertdate);
      row.push(data[i].sku);
      row.push(data[i].description);
      row.push(data[i].qty);
      row.push(data[i].price);
      row.push(data[i].discount);
      row.push(data[i].total);
      row.push(data[i].approvedby);
      row.push(data[i].cashier_name);
      dataexcel.push(row);
    }
  } else if (jenis_laporan == "get_report_sales_non_cash") {
    data = get_excel_sales_non_cash();
    var row_title = [];
    row_title.push("No");
    row_title.push("Sales Date");
    row_title.push("Payment Method Name");
    row_title.push("EDC Name");
    row_title.push("Value Amount");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].no);
      row.push(data[i].salesdate);
      row.push(data[i].paymentmethodname);
      row.push(data[i].edcname);
      row.push(data[i].valueamount);
      dataexcel.push(row);
    }
  } else if (jenis_laporan == "get_report_sales_today") {
    data = get_excel_sales_today();
    var row_title = [];
    row_title.push("Name Store");
    row_title.push("Omset");
    row_title.push("STD");
    row_title.push("APC");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].namestore);
      row.push(data[i].omset);
      row.push(data[i].std);
      row.push(data[i].apc);
      dataexcel.push(row);
    }
  }

  var csv = "";
  dataexcel.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = title_report + ".csv";
  hiddenElement.click();
});





function get_report_sales_by_cashier() {
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/report_sales_cashier.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_sales_by_cashier");
      $("#title_report").html("Report Sales By Cashier");
      $("#tablesalesbycashier").show();
      $("#tablesalesbycashier").DataTable({
        data: dataResult,
        columns: [
          { data: "no" },
          { data: "start_date" },
          { data: "close_date" },
          { data: "cashier_name" },
          { data: "balance" },
          { data: "sales" },
          { data: "discount" },
          { data: "refund" },
          { data: "net_sales" },
          { data: "sales_non_cash" },
          { data: "cash_in_sistem" },
          { data: "cash_in_drawer" },
          { data: "variant" },
          { data: "infaq" },
          { data: "status" },
        ],
      });
    },
  });
}

function get_report_sales_daily() {
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_daily.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_sales_daily");
      $("#title_report").html("Report Sales Daily");
      $("#tablesalesdaily").show();
      $("#tablesalesdaily").DataTable({
        data: dataResult,
        columns: [
          { data: "no" },
          { data: "sales_date" },
          { data: "close_time" },
          { data: "sales" },
          { data: "discount" },
          { data: "refund" },
          { data: "net_sales" },
          { data: "sales_non_cash" },
          { data: "cash_in_sistem" },
          { data: "cash_in_drawer" },
          { data: "variant" },
          { data: "infaq" },
          { data: "remark" },
          { data: "closed_by" },
        ],
      });
    },
  });
}

function get_report_sales_void() {
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_void.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);

      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_sales_void");
      $("#title_report").html("Report Sales Void");
      $("#tablesalesvoid").show();
      $("#tablesalesvoid").DataTable({
        data: dataResult,
        columns: [
          { data: "no" },
          { data: "insertdate" },
          { data: "sku" },
          { data: "description" },
          { data: "qty" },
          { data: "price" },
          { data: "discount" },
          { data: "total" },
          { data: "approvedby" },
          { data: "cashier_name" },
        ],
      });
    },
  });
}

function get_report_sales_non_cash() {
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/report_sales_non_cash.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);

      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_sales_non_cash");
      $("#title_report").html("Report Sales Non Cash");
      $("#tablesalesnoncash").show();
      $("#tablesalesnoncash").DataTable({
        data: dataResult,
        columns: [
          { data: "no" },
          { data: "salesdate" },
          { data: "paymentmethodname" },
          { data: "edcname" },
          { data: "valueamount" },
        ],
      });
    },
  });
}

function get_report_sales_today() {
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_today.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_sales_today");
      $("#title_report").html("Report Sales Today");
      $("#tablesalestoday").show();
      $("#tablesalestoday").DataTable({
        data: dataResult,
        columns: [
          { data: "tanggal" },
          { data: "namestore" },
          { data: "omset" },
          { data: "std" },
          { data: "apc" },
        ],
      });
    },
  });
}



function get_excel_sales_by_cashier() {
  var dataResults = "";
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/report_sales_cashier.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      // console.log(dataResult);
      dataResults = JSON.parse(dataResult);
    },
  });
  return dataResults;
}


function get_excel_sales_daily(){
  var dataResults = "";
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_daily.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      // console.log(dataResult);
      dataResults = JSON.parse(dataResult);
    },
  });
  return dataResults;
}

function get_excel_sales_void(){
  var dataResults = "";
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_void.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      // console.log(dataResult);
      dataResults = JSON.parse(dataResult);
    },
  });
  return dataResults;
}

function get_excel_sales_non_cash(){
  var dataResults = "";
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/report_sales_non_cash.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      // console.log(dataResult);
      dataResults = JSON.parse(dataResult);
    },
  });
  return dataResults;
}

function get_excel_sales_today(){
  var dataResults = "";
  $.ajax({
    url:
      "http://" + api_storeapps + "/pi/api/cyber/report_sales_today.php",
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses sync stock");
    },
    async: false,
    success: function (dataResult) {
      // console.log(dataResult);
      dataResults = JSON.parse(dataResult);
    },
  });
  return dataResults;
}


