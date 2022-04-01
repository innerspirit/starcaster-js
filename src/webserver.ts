import { resolve } from 'path';
import http from 'http';
import fs from 'fs';
import _ from 'lodash';

export function render(res: any, tplfile: string, data: Object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  const template = getHbsTemplate(tplfile);

  res.end(template(data));
}

export function runWebServer(server: http.Server) {
  const hostname = '127.0.0.1';
  const port = 3000;
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function getHbsTemplate(tplfile: string) {
  const tplstring = fs.readFileSync(resolve(__dirname, "../assets/templates/" + tplfile));
  const template = _.template(String(tplstring));
  return template;
}
