'use strict';

var SwaggerExpress = require('swagger-express-mw');
const cors = require('cors');
var app = require('express')();
// module.exports = app; // for testing

app.use(cors());
var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  console.log('port', process.env.PORT);
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
