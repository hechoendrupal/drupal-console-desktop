const ipc = require('electron').ipcRenderer;

$(document).ready(function() {
  ipc.send('command', '{"cmd": "version"}');
  ipc.send('init');
  ipc.on('version', function (event, data) {
    notify(data);
  });
  ipc.on('init', function(event, sites) {
    var len = sites.length;
    $('.commands').css("visibility", "visible");
    if (len > 0) {
      for (var i = 0, len; i < len; i++) {
        $('.sites').append('<li><button id=' + sites[i].url + '\'>' + sites[i].url + '</button></li>');
      }
    }
  });
  ipc.on('loading', function (event, data) {
    $('#overlay').css("visibility", "visible");
  });
  ipc.on('done-loading', function (event, data) {
    $('#overlay').css("visibility", "hidden");
  });
  ipc.on('addSite', function (event, data) {
    $('.sites').append('<li><button id=' + data.url + '\'>' + data.url + '</button></li>');
  });
  ipc.on('debug', function (event, data) {
    $('.console-log').append(data);
  });
  $('#btnAddSite').click(function() {
    ipc.send('addSite');
  });
  $('#btnClearSites').click(function() {
    ipc.send('command', '{"cmd":"clear"}');
    $('.sites').empty();
  });
  $('#cmdStatus').click(function() {
    console.log('cmdStatus click');
    var status = '{"path": "/Users/willwh/Sites/drupal8.dev/docroot", "url": "localhost", "cmd":"status"}';
    ipc.send('command', status);
  });
});

function notify(message) {
  var myNotification = new Notification('dcapp', {
    body: message
  });
}
