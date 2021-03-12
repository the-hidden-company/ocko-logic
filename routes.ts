import * as Hapi from "@hapi/hapi";
import home from "./routes/home"
import mista from "./routes/mista"
import lide from "./routes/lide"

let routes: Hapi.ServerRoute[];

routes = [
  {
    method: 'GET',
    path: '/',
    handler: home 
  },
  {
    method: 'GET',
    path: '/mista',
    handler: mista
  },
  {
    method: 'POST',
    path: '/lide',
    handler: lide,
    options: {
      cors: true
    }
  },
];

export default routes;
