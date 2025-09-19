    var express = require("express");
    var app = express();
    var port = 4000;

    app.get("/", function(req, res) {
        res.sendFile(__dirname + '/pages/LandingPage.jsx')
    });

    app.listen(port, function() {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
