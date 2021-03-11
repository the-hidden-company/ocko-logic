import * as Hapi from "@hapi/hapi";
import routes from "./routes";

const init = async () => {
  const server = Hapi.server({
    port: 9756,
    host: "0.0.0.0",
  });

  server.route(routes);

  await server.start();
  console.log("Started at", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
