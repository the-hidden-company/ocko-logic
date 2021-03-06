import * as Hapi from "@hapi/hapi";
import home from "./routes/home"
import mista from "./routes/mista"
import lide from "./routes/lide"
import list from "./routes/list"
import pomer from "./routes/pomer"
import ockovani from "./routes/ockovani"


let routes: Hapi.ServerRoute[];

routes = [
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return "Welcome!" 
    } 
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
  },
  {
    method: 'POST',
    path: '/list',
    handler: list,
  },
  {
    method: 'POST',
    path: '/pomer',
    handler: pomer,
  },
  {
    method: 'POST',
    path: '/ockovani',
    handler: ockovani
  }
];

export default routes;
   