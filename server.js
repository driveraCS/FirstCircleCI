var express = require('express'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3000,
	app = express();

app.use(bodyParser.json());

var locationList = [];

app.get('/users/1', function(req, res) {
	var user = {
		name: "Diego",
		email: "diego@test.com",
		phoneNumber: "87654321",
	};
	res.send(user);
});

app.put('/users/1', function(req, res) {
	var user = {
		name: req.body.name,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
	};
	res.send(user);
});

app.post('/locations', function(req, res) {
	var location = {
		addressProvince: req.body.addressProvince,
		addressCanton: req.body.addressCanton,
		addressDistrict: req.body.addressDistrict,
		userId: req.body.userId
	};
	locationList.push(location);
	res.send(location);
});

app.get('/users/1/location', function(req, res) {
	res.send(locationList[0]);
});

app.get('/users/2/location', function(req, res) {
   if (req.body.userId == 2) {
 		res.send(locationList[0]);
 	} else {
		res.sendStatus(401);
 	}
});

server = app.listen(port);
console.log("Server up, Port: ", port)
module.exports = server;