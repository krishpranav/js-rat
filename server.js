// const values
const userPasscode = "1234";
const scriptPath = process.cwd() + "\\server.js";
const port = 8080;

const express = require("express");
const session = require("express-session")
const app = express();
const server = app.listen(port)

const Service = require("node-windows").Service;

const { exec } = require("child_process");

const fs = require("fs");
const path = require("path");
const body_parser = require("body-parser");