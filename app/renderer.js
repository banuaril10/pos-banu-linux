const shell=require('electron').shell
const os=require('os')
const modal = require('electron-modal');
const path = require('path');
var $ = require("jquery");
const { remote: { BrowserWindow }, ipcRenderer: ipc } = require("electron");

// const filemanagerbtn=document.getElementById('filemanager')

// filemanagerbtn.addEventListener('click',function (event){
//     shell.showItemInFolder(os.homedir())
// })


//Get active user
 const divusername = document.getElementById('divusername');

if (localStorage.getItem('user') == null) {  
    $('#loginmod').modal('show');
} else {
    var objuser = JSON.parse(localStorage.getItem('user').replace('[','').replace(']','')); 
    divusername.innerHTML =  objuser.username;
}



ipc.on("window-id-sent", (event,id) => {
    BrowserWindow.fromId(id).close();
 });

