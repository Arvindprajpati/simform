var express = require("express");
var path = require("path");
require("dotenv").config();
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");
const fileUpload = require('express-fileupload');
// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {

		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
var db = mongoose.connection;

var app = express();


app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
//To allow cross-origin requests
app.use(cors());
app.use(fileUpload());
//Route Prefixes
app.get('/', (req, res) => {
	return res.send('<h2>Welcome to Express App<h2>');
})
app.use("/api/", apiRouter);


app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

var port = process.env.PORT || 3000;

app.listen(port, (err) => {
	if (err) {
	   console.log(err)
   } else {
	   console.log('Server is listening at :' + port);
	}
});
module.exports = app;