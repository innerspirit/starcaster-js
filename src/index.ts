import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QSystemTrayIcon, QMenu, QAction } from '@nodegui/nodegui';
import { resolve } from 'path';
import logo from '../assets/logox200.png';
const http = require('http');

const trayIcon = new QIcon(
  resolve(__dirname, "../assets/testicon.jpg")
);
const tray = new QSystemTrayIcon();

const menu = new QMenu();
tray.setContextMenu(menu);

//Each item in the menu is called an action
const visibleAction = new QAction();
menu.addAction(visibleAction);
visibleAction.setText('Show/Hide');
visibleAction.addEventListener('triggered', () => {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
});

tray.setIcon(trayIcon);
tray.show();

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req: any, res: any) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const win = new QMainWindow();
win.setWindowTitle("Hello World");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Hello");

const button = new QPushButton();
button.setIcon(new QIcon(logo));

const label2 = new QLabel();
label2.setText("World");
label2.setInlineStyle(`
  color: red;
`);

rootLayout.addWidget(label);
rootLayout.addWidget(button);
rootLayout.addWidget(label2);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.show();

(global as any).win = win;
(global as any).tray = tray; // prevents garbage collection of tray
