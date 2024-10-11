require("jquery");
require("popper.js");
require("bootstrap");
const { show } = require("electron-modal");
var $ = require("jquery");

var cashierid = "";
var ad_org_id = "";
var userid = "";
var username = "";
var useridval = "";
var strsalesdate = "";

// get cashier information
$("#loaderpos").html(
  "<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />"
);
getinfo();
$("#loaderpos").hide();


var usersupervisor = $("#usersupervisor").val();

function getinfo(){
  var objinfo = JSON.parse(localStorage.getItem('info'));
  var objuser = JSON.parse(localStorage.getItem('user'));
  cashierid=objinfo.cashierid;
  userid=objuser.id;
  useridval=objuser.userid;
  username = objuser.username;
  ad_org_id=objinfo.ad_morg_key;
  divshopname.innerHTML =  objinfo.shopname;
  divcashiername.innerHTML = objuser.username;
  // divcashiername.innerHTML =  objinfo.cashiername;
};

var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}

// log out
const btnback = document.getElementById("btnback");
btnback.addEventListener("click", function (event) {
  window.location.href = `file:///${__dirname}/home.html`;
});

const btnsavecashin = document.getElementById("btnsavecashin");
btnsavecashin.addEventListener("click", async function (event) {
  save_cashin(username, ad_org_id, userid);
});

function save_cashin(username, ad_org_id, userid) {
  var cash = document.getElementById("cash").value;
  // alert(cash);
  // var nama_insert = document.getElementById("nama_insert").value;
  // var org_key = document.getElementById("org_key").value;
  var nama_insert = username;
  var org_key = ad_org_id;

  // alert(cash);
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/save_cashin.php",
    type: "POST",
    data: {
      cash: cash,
      username: nama_insert,
      ad_org_id: org_key,
      userid: userid,
    },
    cache: false,
    beforeSend: function () {
      $("#notif").html("Proses input cashin..");
    },
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      if (dataResult.result == "1") {
        $("#notif").html(
          '<font style="color: green">' + dataResult.msg + "</font>"
        );
        $("#overlay").fadeOut(300);
        location.reload();
      } else {
        $("#overlay").fadeOut(300);
        $("#notif").html(dataResult.msg);
      }
    },
  });
}

document.getElementById("date").value = new Date().toISOString().slice(0, 10);

const btnfiltercashin = document.getElementById("btnfiltercashin");
btnfiltercashin.addEventListener("click", async function (event) {
  showcashin(username, ad_org_id, userid);
});
;



//show value in tbody tbodycashin
showcashin(username, ad_org_id, userid);
function showcashin(username, ad_org_id, userid) {
  var tanggal = document.getElementById("date").value;

  // alert(tanggal);
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/show_cashin.php",
    type: "POST",
    data: {
      ad_org_id: ad_org_id,
      username: username,
      userid: userid,
      tanggal: tanggal,
    },
    cache: false,
    beforeSend: function () {
      $("#loaderpos").show();
    },
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      if (dataResult.result == "1") {
        var no = 1;
        var divbody = "";

        document.getElementById("total_cashin").innerHTML = dataResult.total;

        $.each(dataResult.data, function (key, value) {
          //datatable
          var btnapproved = "";
          var btnreprint = "";
          //tbody
          var approvedby = value.approvedby;
          if (value.status == "0") {
            value.status = "<font class='btn btn-danger'>PENDING</font>";
            value.approvedby = "-";
            btnapproved =
              "<button class='btn btn-success' id='btnapproved' onclick='modal_cashin(\"" +
              value.cashinid +
              "\")'>Approved</button>";
          } else if (value.status == "1") {
            value.status = "<font class='badge badge-success'>APPROVED</font>";
            value.approvedby = approvedby;
            btnapproved =
              "<button class='btn btn-primary' id='btnreprint' onclick='reprint_cashin(\"" +
              value.cashinid +
              "\")'>Reprint</button>";
          }

          divbody +=
            "<tr><td>" +
            no +
            "</td><td>" +
            value.nama_insert +
            "</td><td>" +
            value.cash +
            "</td><td>" +
            value.insertdate +
            "</td><td>" +
            value.status +
            "</td><td>" +
            value.approvedby +
            "</td><td>" +
            value.syncnewpos +
            "</td><td>" +
            value.setoran +
            "</td> <td> " +
            btnapproved +
            "</td></tr>";
          no++;
        });
        $("#tbodycashin").html(divbody);
      }
      $("#loaderpos").hide();
    },
  });
}

async function passwordvalidation(cashinid) {
  var objpassword = get_auth_data(
    "/pos/supervisor",
    {
      f1: $("#usersupervisor").val(),
      f2: $("#genid").val(),
      f3: $("#supervisorpwd").val(),
    },
    false
  );
  if (objpassword.result == "Confirm") {
    // window.location.href = `file:///${__dirname}/setup.html`;
    approved_cashin(cashinid, $("#usersupervisor").val());
  } else {
    //  alert(objpassword.result);
    $("#passwordalert").html(objpassword.result);
  }
};


$("#usersupervisor").select2({
  dropdownParent: $("#passwordmod"),
  ajax: {
    url: api_url + "/selects/select_filter?f3=pos_supervisor_user_get",
    data: function (params, page) {
      return {
        //f4: params.term, // search term
        f4: useridval,
        page_limit: 10,
      };
    },
    dataType: "json",
    headers: { Authorization: localStorage.getItem("token").replace('"', "") },
    delay: 250,
    processResults: function (data) {
      //alert(userid);

      return {
        results: data.data,
      };
    },
  },
});

// Supervisor Password
$("#usersupervisor").on("select2:select", function (e) {
  var now = new Date();
  // console.log(now.getMinutes());
  var intcode = parseInt(now.getDay() + "" + now.getSeconds()) * 3;
  $("#genid").val(intcode);
  $("#supervisorpwd").focus();
});


function openpassword(id){
  $('#usersupervisor').val('');
  $("#genid").val('');
  $("#supervisorpwd").val('');
  $("#cashinid").val(id);

  // alert(id);

  if (isDialogSupported) {
    passwordmod.showModal();
  } else {
    passwordmod.setAttribute("open", "");
  };
  passwordmod.querySelector("input").focus();
};



$("#supervisorpwd").keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    passwordvalidation($("#cashinid").val());
  }
});

//buttonpasswordsubmit
const buttonpasswordsubmit = document.getElementById("buttonpasswordsubmit");
buttonpasswordsubmit.addEventListener("click", async function (event) {
  passwordvalidation($("#cashinid").val());
});

function modal_cashin(id) {
  openpassword(id);
}

function approved_cashin(id, userspv) {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/approve_cashin.php",
    type: "POST",
    data: {
      id: id,
      userspv: userspv,
    },
    cache: false,
    beforeSend: function () {
      $("#notif").html("Proses approved cashin..");
    },
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      if (dataResult.result == "1") {
        $("#notif").html(
          '<font style="color: green">' + dataResult.msg + "</font>"
        );
        $("#overlay").fadeOut(300);
        reprint_cashin(id);
        location.reload();
      } else {
        $("#overlay").fadeOut(300);
        $("#notif").html(dataResult.msg);
      }
    },
  });
}


function reprint_cashin(id) {
  // alert(id);
  var number = 0;
  var no = 1;	
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/reprint_cashin.php",
    type: "POST",
    data: {
      id: id,
    },
    cache: false,
    beforeSend: function () {
      $("#notif").html("Proses reprint cashin..");
    },
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      var html = "PICKUP CASH IN (SETORAN KE-" + dataResult.setoran + ")\n\n";
      html += "Tanggal     : " + dataResult.tanggal + " \n";
      html += "Nama Kasir  : " + dataResult.username + " \n";
      html += "Approved By : " + dataResult.approvedby + " \n\n";
      html +=
        "No | " +
        textbyline("Jam", 9, "right") +
        " | " +
        textbyline("Cash", 13, "right") +
        " \n";

      var panjang = dataResult.data.length;

      for (let i = 0; i < dataResult.data.length; i++) {
        let data = dataResult.data[i];
        var jam = data.jam;
        var cash = data.cash;

        html += no + "  |  " + jam + " | ";
        html += textbyline("" + cash + "", 13, "right");
        html += "\n";

        number++;
        no++;

        if (number == panjang) {
          html += "\n Ttd Ka. Toko / Wkl Ka. Toko";
          html += "\n";
          html += "\n";
          html += "\n";
          html += "\n";
          html += "==========================";
          html += "\n";

          print(html);
          console.log(html);
        }
      }
    },
  });
}


$("#tablecashin").DataTable();
