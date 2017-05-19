'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var cors = require('cors');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
	app.use(cors());
  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);
});
