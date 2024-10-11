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

;
const date_awal = document.getElementById("date_awal");
const date_akhir = document.getElementById("date_akhir");

//value date now
var today = new Date();



date_awal.value = today
  .toISOString("dd/mm/yyyy")
  .substr(0, 10)
  .toString("dd/mm/yyyy");
date_akhir.value = today
  .toISOString("dd/mm/yyyy")
  .substr(0, 10)
  .toString("dd/mm/yyyy");

//change format date dd/mm/yyyy



// log out
const btnback = document.getElementById("btnback");
btnback.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/report.html`;
});

const btnpi = document.getElementById("btnpi");

function hide_all() {
  $("#tablepi").DataTable().destroy();
  $("#tablepi").hide();
}

btnpi.addEventListener("click", async function (event) {
  hide_all();
  get_report_pi(date_awal, date_akhir);
});

btnexportexcel.addEventListener("click", async function (event) {
  var jenis_laporan = $("#jenis_laporan").val();
  var title_report = $("#title_report").html();
  var table = "";
  var data = "";
  var dataexcel = [];

  if (jenis_laporan == "get_report_pi") {
    data = get_excel_pi();
    var row_title = [];

    row_title.push("No");
    row_title.push("Tanggal");
    row_title.push("Mode");
    row_title.push("Description");
    
    row_title.push("No Doc");
    row_title.push("Sistem");
    row_title.push("Fisik");
    row_title.push("Selisih");
    row_title.push("Created By");
    row_title.push("Approval By");

    dataexcel.push(row_title);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      row.push(data[i].no);
      row.push(data[i].tanggal);
      row.push(data[i].pi_mode);
      row.push(data[i].description);
      row.push(data[i].no_doc_pi);
      row.push(data[i].sistem);
      row.push(data[i].fisik);
      row.push(data[i].selisih);
      row.push(data[i].created_by);
      row.push(data[i].approval_by);
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



function get_report_pi(date_awal, date_akhir) {
  $.ajax({
    url:
      "http://" +
      api_storeapps +
      "/pi/api/cyber/report_pi.php?date_awal=" + date_awal.value + "&date_akhir=" + date_akhir.value,
    type: "GET",
    beforeSend: function () {
      $("#statussync").html("proses");
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      $("#jenis_laporan").val("get_report_pi");
      $("#title_report").html("Report PI");
      $("#tablepi").show();
      $("#tablepi").DataTable({
        data: dataResult,
        columns: [
          { data: "no" },
          { data: "tanggal" },
          { data: "pi_mode" },
          { data: "description" },
          { data: "no_doc_pi" },
          { data: "sistem" },
          { data: "fisik" },
          { data: "selisih" },
          { data: "created_by" },
          { data: "approval_by" },
        ],
      });
    },
  });
}


function get_excel_pi() {
  var dataResults = "";
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/report_pi.php",
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

