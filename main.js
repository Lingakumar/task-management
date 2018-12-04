const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cors = require("cors");
const resourcesRoute = require('./src/server/src/serverjs/routes/resourceroute');
//const departmentRoute = require('./src/serverjs/routes/departmentroute');
const projectRoute = require('./src/server/src/serverjs/routes/projectroute');
const adminRoute = require('./src/server/src/serverjs/routes/admin_route');
const authorizer = require('./src/server/src/serverjs/routes/authorizer');
const util = require('./src/server/src/serverjs/utils/util');
const dbUtil = require('./src/server/src/serverjs/model/dbUtil');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(expressSession({
    secret: 'skava',
    resave: false,
    rolling: true, 
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 900000}
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Max-Age", "600");
    next();
});
const checkSession = (req, res, next) => {
    let message = [];
    if(req.session) {
        let session = req.session || null;
        if(session.user) {
            req.session.save();
            next();
        }
        else {
            message.push("Please login to continue");
            res.status(401).send(util.returnResp("Failure", message));
        }
    }
}
//app.all('*',checkSession);
app.use('/resources/', checkSession, resourcesRoute);
app.use('/project/', checkSession, projectRoute);
app.use('/account/', checkSession, authorizer);
app.use('/user/',adminRoute);
app.get('/get/:id', (req, res) => {
    let collectionName = req && req.params && req.params.id ? req.params.id : "";
    dbUtil.getDataFromCollection(collectionName)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.send(err);
    });
});
app.delete('/delete/:id', (req, res) => {
    let collectionName = req && req.params && req.params.id ? req.params.id : "";
    dbUtil.dropCollection(collectionName)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.send(err);
    });
});
var port = process.env.PORT || 8080; 
var server = app.listen(4000, function () {
  console.log("app running on port.", server.address().port);
});