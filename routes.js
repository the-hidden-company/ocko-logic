"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("./routes/home");
let routes;
routes = [
    {
        method: 'GET',
        path: '/',
        handler: home_1.default
    },
];
exports.default = routes;
