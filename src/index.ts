import http from 'http';

import { pp } from './utils';
import { render, runWebServer } from './webserver';
import { setupTrayIcon } from './windows-ui';
import { setupBnet, getLastMatches } from './bnetapi';

const tray = setupTrayIcon();
(global as any).tray = tray; // prevents garbage collection of tray

setupWebServer();

async function setupWebServer() {
  const bnet = await setupBnet();
  const lb = await bnet.getLeaderboards();
  pp(lb);

  const server = http.createServer(async (req: any, res: any) => {
    const data = await getLastMatches();
    render(res, 'last5.hbs', data);
  });

  runWebServer(server);
}
