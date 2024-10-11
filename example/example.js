const {PosPrinter} = require("electron-pos-printer");

// or in render process
// const {PosPrinter} = require('electron').remote.require("electron-pos-printer");

// each object in the data array accounts for a row or line
const print_data = [
   {type: 'text', value: 'Sample text', style: 'text-align:center;font-weight: bold'},
   {type: 'text', value: 'Another text', style: 'color: #fff'}
];

// returns promise<any>
 PosPrinter.print(print_data, {
    printerName: 'POS THERMAL',
    preview: false,
    width: '170px',               //  width of content body
    margin: '0 0 0 0',            // margin of content body
    copies: 1,                   // The number of copies to print
  })
  .then(() => {
    // some code ...
  })
  .catch((error) => {
    console.error(error);
   });