import { QIcon, QSystemTrayIcon, QMenu, QAction } from '@nodegui/nodegui';
import { resolve } from 'path';

export function setupTrayIcon() {
  const trayIcon = new QIcon(
    resolve(__dirname, "../assets/testicon.jpg")
  );
  const tray = new QSystemTrayIcon();

  const menu = new QMenu();
  tray.setContextMenu(menu);

  //Each item in the menu is called an action
  const visibleAction = new QAction();
  menu.addAction(visibleAction);
  visibleAction.setText('Exit Starcaster');
  visibleAction.addEventListener('triggered', () => {
    process.exit(0);
  });

  tray.setIcon(trayIcon);
  tray.show();
  return tray;
}
