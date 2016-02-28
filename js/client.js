const ipc = require('electron').ipcRenderer;
const fixPath = require('fix-path');

$(document).ready(function() {
  fixPath();
  ipc.send('command', 'version');
  ipc.send('debug');
  ipc.on('version', function (event, data) {
    // Append to the #version div in index.html
    $('#version').append(data + '<br />');
    notify(data);
  });
  ipc.on('debug', function (event, data) {
    console.log(process.env.PATH);
  });
});

function notify(message) {
  var myNotification = new Notification('dcapp', {
    body: message
  });
}