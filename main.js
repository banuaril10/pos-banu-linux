// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain: ipc,shell,globalShortcut } = require('electron');
const debug = require('electron-debug');
const modal = require('electron-modal');
const os=require('os');
const Store = require('electron-store');
const store = new Store();
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const secret = 'marinuak';
var macaddress = require('macaddress');


//call sync_sales.js


function getconfig(){
  var strconfig = fs.readFileSync(app.getPath('documents')+'/pos/config.ini');
  // var strconfig_printer = fs.readFileSync(app.getPath('documents')+'/pos/printer.ini');
  
  let json_printer = fs.readFileSync(app.getPath('documents')+'/pos/printer.json');
  //let json_config = fs.readFileSync(app.getPath("documents") + "/pos/confignew.json");
  let json_config = fs.readFileSync(app.getPath("documents") + "/pos/config.json");
  
  let strconfig_config = JSON.parse(json_config);
  store.set("domain", strconfig_config["domain"].toString());
  store.set("locationid", strconfig_config["organization"].toString());

  let strconfig_printer = JSON.parse(json_printer);
  

  // var strconfig = 'localhost';
  console.log('AAAA',strconfig.toString(), app.getPath('documents'));
  
  //live
  //store.set('api', 'http://'+strconfig.toString()+':8080/api');
  //test
   store.set('api', 'http://'+strconfig.toString()+':8080/api');
   store.set('ip_printer', strconfig_printer['ip_printer'].toString());
   store.set('jenis_printer', strconfig_printer['jenis_printer'].toString());
   store.set('ip_server', strconfig.toString());
   
   var base_url = strconfig.toString().split(":");
   let word = base_url[0];
   
   store.set('api_storeapps', word.toString());
   
   console.log('AAAABBBB',strconfig_printer['ip_printer'].toString());
   console.log('api store apps',word.toString());
   // alert(strconfig_printer['ip_printer'].toString());
 // store.set('api', 'http://'+strconfig.toString()+':3001/api');
};

getconfig();

macaddress.one(function (err, mac) {
  console.log("Mac address for this host: %s", mac); 
  store.set('mac',mac); 
});


//debug();
let mainWindow;
//let workerWindow;
function createWindow () {
  // Create the browser window.

   mainWindow = new BrowserWindow({
    fullscreen:true,
    width: 1000,
    height: 600,
    icon: path.join(__dirname, 'assets/icons/png/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen:true,
	    contextIsolation: false,
	    enableRemoteModule: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./app/register.html')
 // mainWindow.loadFile('./app/test.html')


//modal window
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'modal') {
      // open window as modal
      event.preventDefault()
      Object.assign(options, {
        modal: true,
        parent: mainWindow,
        width: 100,
        height: 100
      })
      event.newGuest = new BrowserWindow(options)
    }
  });

  // Open the DevTools.
 //  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  globalShortcut.register('f9', function() {
		console.log('f9 is pressed')
		mainWindow.reload()
	})

}

function createWindowPriceTag(texthtml) {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    fullscreen: false,
    width: 1000,
    height: 600,
    icon: path.join(__dirname, "assets/icons/png/icon.png"),
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      contextIsolation: false,
      enableRemoteModule: true,

      //  devTools: false
    },
  });

  mainWindow.loadFile("./app/register.html");
  // load text html
  // mainWindow.loadURL(`data:text/html;charset=utf-8,${texthtml}`);
  
  //modal window
  mainWindow.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === "modal") {
        // open window as modal
        event.preventDefault();
        Object.assign(options, {
          modal: true,
          parent: mainWindow,
          width: 100,
          height: 100,
        });
        event.newGuest = new BrowserWindow(options);
      }
    }
  );

  // Open the DevTools.
  //  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  globalShortcut.register("f9", function () {
    console.log("f9 is pressed");
    mainWindow.reload();
  });
}



function gethome(){
  store.set('print_path', app.getPath('documents'));
}


app.on('ready', function() {
  createWindow();
  gethome();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});

ipc.on("send-window-id", (event) => {
  event.sender.send("window-id-sent", mainWindow.id);
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});
