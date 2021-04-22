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

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

// main route for the web app
app.get("/", function(req, res) {
    res.render("index");
});

// route for installing the rat web app
app.post("/install", function(res, req) {
    if(req.body.passcode === userPasscode) {
        let svc = new Service({
            name:"js-rat",
            description:"Remote Access Tool Made In Javascript",
            script:scriptPath
        });

        svc.on("install", function(){
            res.sessionID("The service has been installed");
            svc.start();
        });

        svc.install();
    }
});

// route for uninstalling the rat web app
app.post("/uninstall", function(req, res) {
    if (req.body.passcode === userPasscode) {
        let svc = new Service({
            name:"js-rat",
            description:"Remote Access Tool Made In Javascript",
            script:scriptPath
        });

        svc.on("uninstall", function() {
            res.send("The service has been uninstalled");
        });

        svc.uninstall();
    }
});