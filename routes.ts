import * as Hapi from "@hapi/hapi";
import home from "./routes/home"

let routes: Hapi.ServerRoute[];

routes = [
  {
    method: 'GET',
    path: '/',
    handler: home
  },
];

export default routes;
