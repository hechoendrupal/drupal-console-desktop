const ipc = require('electron').ipcRenderer;

$(document).ready(function() {
  ipc.send('command', 'version');
  ipc.on('version', function (event, data) {
    // Append to the #version div in index.html
    $('#version').append(data + '<br />');
    notify(data);
  });
  ipc.on('debug', function (event, data) {
    console.log(data);
  });
});

function notify(message) {
  var myNotification = new Notification('dcapp', {
    body: message
  });
}