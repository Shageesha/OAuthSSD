'use strict'

var express = require('express');
var bodyParser = require('body-parser');
const FB = require('fb');
const app = express();

const HostName = "localhost";
const AppID = "233828744192179"; //Generated App id key
const AppSecretID = "0d6f63d9c8331fe98b868aeadf7b9b94"; //Generated secret key

app.use(express.static("."));
app.use(express.static(__dirname + "./views"));
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

//Get login path -> index.html
app.get('/login', (req, res, next) => {
    res.status(200).sendFile(__dirname + "/views/index.html");
});

app.get("/FBOAuth", (req, res) => {
    if (req.query && req.query.code) {
        FB.api( "oauth/access_token",
            {
                client_id: AppID,
                client_secret: AppSecretID,
                redirect_uri: "http://localhost:9000/FBOAuth",
                code: req.query.code
            },
            response => {
                let accesToken = response.access_token;
                let fields = "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email";
                FB.api("me", { fields: fields, access_token: accesToken }, fbValues => {
                    if (!fbValues.error) {
                        console.log("Getting the values...", fbValues);
                        res.render("show", {
                            title: "OAuth 2.0 | Facebook",
                            heading: "Retrieve user profile information | IT15147288",
                            profilePicUrl: fbValues.picture.data.url,
                            fullName: fbValues.name,
                            email: fbValues.email
                        });
                    } else {
                        console.log("Error occured when getting values...", fbValues.error.message);
                        res.render("show", {
                            title: "Error",
                            heading: fbValues.error.message
                        });
                    }
                });
            }
        );
    } else if (req.query.error) {
        console.log("Error", req.query.error);
    } else {
        console.log("Something Happened.. Please restart..!");
    }
});

//App listening to port 9000
app.listen(9000, err => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Listening to port 9000");
    }
})