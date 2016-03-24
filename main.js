'use strict';
const shell = require('shelljs');
const electron = require('electron');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const storage = require('electron-json-storage');
const path = require('path');
var sites;

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.send('init');
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('command', function(event, cmd) {
  var command = JSON.parse(cmd);
  switch(command.cmd) {
    case 'clear':
      storage.set('sites', [], function(error) {
        if (error) throw error;
      })
      break;
    case 'generate':
      shell.exec('drupal generate:module', function(code, stdout, stderr) {
        if (!stderr) {
          event.sender.send('output', stdout);
        }
        else {
          // @todo error handling globally nicely with the client
        }
      });
      break;
    case 'status':
      console.log('weee');
      event.sender.send('loading');
      consoleExec(command.path, 'drupal ss', function (data) {
          event.sender.send('debug', data);
          event.sender.send('done-loading');
      });
    case 'version':
      shell.exec('drupal --version', function(code, stdout, stderr) {
        if (!stderr) {
          event.sender.send('version', stdout);
        }
        else {
          // @todo error handling globally nicely with the client
        }
      });
      break;

    default:
  }
});

ipc.on('addSite', function(event, data) {
  // First fetch the current sites array
  storage.get('sites', function(error, sites) {
      if (error) {
        console.log(error);
      }
      if (sites.length >= 1) {
        dialog.showOpenDialog({ properties: [ 'openDirectory']}, function(data) {
          if (data) {
            var site = { 'url': 'localhost', 'path': data[0]};
            sites.push(site);
            storage.set('sites', sites, function(error) {
              if (error) throw error;
              event.sender.send('addSite', site);
            })
          }
        });
      }
      else {
          dialog.showOpenDialog({ properties: [ 'openDirectory']}, function(data) {
            if (data) {
             var sites = [{ 'url': 'localhost', 'path': data[0]}];
              storage.set('sites', sites, function(error) {
                if (error) throw error;
              })
              console.log(sites[0]);
              event.sender.send('addSite', sites[0]);
            }
          });
        }
  })
  //@todo We need to use Drupal Console to get the site URL from the path they choose
});

// Init dcapp
ipc.on('init', function(event, data) {
  storage.get('sites', function(error, sites) {
      if (error) {
        console.log(error);
      }
      if (sites.length >= 1) {
        event.sender.send('init', sites);
      }
  })
});

function consoleExec(cwd, cmd, cb) {
  shell.exec(cmd, {cwd: cwd}, function(code, stdout, stderr) {
    if (!stderr) {
      cb(stdout);
    }
    else {
      // @todo error handling globally nicely with the client
    }
  });
}
