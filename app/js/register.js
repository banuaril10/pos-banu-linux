require("jquery");
require("popper.js");
require("bootstrap");
var $ = require("jquery");
//var hascode='';
$("#loaderpos").html(
  "<img id='loading-image' src='./img/loading2.gif' alt='Loading...' />"
);
// Get Shop
$("#loaderpos").hide();
var isDialogSupported = true;
if (!window.HTMLDialogElement) {
  document.body.classList.add("no-dialog");
  isDialogSupported = false;
}
// const store = new Store();

// const domain = store.get("domain");
// const locationid = store.get("locationid");
console.log(domain);
if (domain == "") {
  checkorg(has, domain, locationid);
  getusersit();
} else {
  getidlocationbyname();
}

function getidlocationbyname() {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/change_config.php",
    type: "GET",
    async: false,
    success: function (dataResult) {
      console.log(dataResult);

      //write to config.json
      var fs = require("fs");
      var path = require("path");
      var app = require("electron").remote.app;
      var json_config = JSON.parse(dataResult);
      var json = JSON.stringify(json_config);
      fs.writeFileSync(
        app.getPath("documents") + "/pos/config.json",
        json,
        "utf8"
      );

      let json_file = fs.readFileSync(
        app.getPath("documents") + "/pos/config.json"
      );

      let strconfig_config = JSON.parse(json_file);
      store.set("domain", strconfig_config["domain"].toString());
      store.set("locationid", strconfig_config["organization"].toString());

      location.reload();
    },
  });
}

function getusersit() {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/sync_users_it.php",
    type: "GET",
    async: false,
    success: function (dataResult) {
      //console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      console.log(dataResult.data);
      var data = dataResult.data;
      var html = "";
      for (var i = 0; i < data.length; i++) {
        html +=
          '<option value="' +
          data[i].phone +
          '">' +
          data[i].fullname +
          "</option>";
      }

      $("#divbuttonotp").html(
        '<button type="button" id="btnsendotp" class="btn btn-primary btn-lg btn-block">send otp</button>'
      );
      $("#divusersit").html(
        "<select id='nohp' class='form-control'>" + html + "</select>"
      );

      // var dataResult = JSON.parse(dataResult);
      // alert(dataResult.message);
    },
  });
}

function getcashier() {
  // var objcashier= post_data("/sync/tabledata_free",{api:api_url,f1:'',f2:'proc_pos_mcashier_sync_view',f3:'pos_mcashier_sync',f4:100,f5:0},false);
  // var has = "";

  var objcashier = get_data("/pos/mcashier", { f1: has }, false);
  console.log("xxxxx", objcashier);
  if (objcashier.data != null) {
    window.location.href = `file:///${__dirname}/login.html`;
  } else {
    // hascode=objcashier.has;
    $("#diverror").html(
      '<div class="alert alert-danger text-center" role="alert"><h3>komputer belum terdaftar</h3></div>'
    );
    $("#divhas").html(
      '<div class="alert alert-dark text-center" role="alert">' + has + "</div>"
    );
    $("#divbutton").html(
      '<button type="button" id="btnregister" class="btn btn-success btn-lg btn-block">register</button> <button type="button" id="btnexit" class="btn btn-danger btn-lg btn-block">exit</button> '
    );
    $("#loaderpos").hide();
  }
}

const btnexit = document.getElementById("btnexit");
btnexit.addEventListener("click", function (event) {
  window.close();
});

function checkorg(has, domain, locationid) {
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/get_org.php",
    type: "POST",
    data: {
      has: has,
      domain: domain,
      locationid: locationid,
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);
      if (dataResult.status == "FAILED") {
        //alert(dataResult.message);

        $("#divnotif").html(dataResult.message);
        //hide div
        $("#name").hide();
        $("#divhas").hide();
        $("#divbutton").html(
          '<button type="button" id="btnexit" class="btn btn-danger btn-lg btn-block">exit</button>'
        );
        $("#loaderpos").hide();
      } else {
        getcashier();
      }
      // var dataResult = JSON.parse(dataResult);
      // alert(dataResult.message);
    },
  });
}

const btnregister = document.getElementById("btnregister");
const btnsendotp = document.getElementById("btnsendotp");

btnsendotp.addEventListener("click", async function (event) {
  var nohp = $("#nohp").val();

  sendotp(nohp, has, domain, locationid);

});

btnregister.addEventListener("click", async function (event) {
  var kode_otp = $("#kode_otp").val();
  $("#loaderpos").show();
  register(has, domain, locationid, kode_otp);
});

function sendotp(nohp, has, domain, locationid) {
  //disabled button
  // $("#btnsendotp").prop("disabled", true);
  // $("#btnsendotp").css("background-color", "gray");
  //alert("test");
  // alert(nohp + " " + has + " " + domain + " " + locationid);
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/send_otp.php",
    type: "POST",
    data: {
      nohp: nohp,
      has: has,
      domain: domain,
      locationid: locationid,
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      $("#diverror").html(
        '<div class="alert alert-success text-center" role="alert"><h3>' +
          dataResult.message +
          "</h3></div>"
      );
      $("#loaderpos").hide();
        // $("#btnsendotp").prop("disabled", false);
        // $("#btnsendotp").css("background-color", "green");

      //enable
    },
  });
}

function register(has, domain, locationid, kode_otp) {
  var name = $("#name").val();
  $.ajax({
    url: "http://" + api_storeapps + "/pi/api/cyber/sync_register.php",
    type: "POST",
    data: {
      has: has,
      domain: domain,
      locationid: locationid,
      name: name,
      kode_otp: kode_otp,
    },
    async: false,
    success: function (dataResult) {
      console.log(dataResult);
      var dataResult = JSON.parse(dataResult);

      if (dataResult.status == "OK") {
        $("#diverror").html(
          '<div class="alert alert-success text-center" role="alert"><h3>' +
            dataResult.message +
            "</h3></div>"
        );
        location.reload();
      } else {
        $("#diverror").html(
          '<div class="alert alert-danger text-center" role="alert"><h3>' +
            dataResult.message +
            "</h3></div>"
        );
      }
    },
  });
}
