# Swagger Notes
[toc]

## Introduction
1. **Swagger** is an API framework that allows creation of API endpoints in a single *yaml* file. It also provides a number of features, such as a tool for viewing and testing API endpoints through a browser.

2. **General Note**: Working with the Swagger .yaml file can be extremely frustrating, at least until one gets used to it. It is extremely finicky about spacing, but does not have punctuation that might give it more structure. Using the editor can help, but that can be tempermental itself, throwing up seemingly random error signals. It helps to refresh the editor frequently, which often gets rid of otherwise intractible error signals. 

## Setting Up
1. Swagger has a command-line-interface (CLI) which can be installed as follows:
    ```
    sudo npm install -g swagger
    ```
2. From the command line, we can get up and running with Swagger very quickly with a project create commend:
    ```
    swagger project create [project name]
    ```
    Once that is entered, choose the backend framework to use (express, hapi, *etc.*), and get started.

3. Once in the newly created directory, the project can be started from the command line with:
    ```
    swagger project start
    ```
4. We can also open the Swagger project editor, which is a website that allows us to edit our yaml file with error feedback and a GUI that provides lots of information about our endpoints. Simply type from the project directory:
    ```
    swagger project edit
    ```

## The Swagger File
1. The swagger.yaml file will typically be created in the "root/api/swagger" folder. It will have several parts:

    a. first, there will be some general information listed, from project name to host URI and port, *etc*.
    
    b. next comes the heart of the file, the **paths** section. This lists all the endpoints, by path at top level, and then by verb.
    
    c. following that, there is a **definitions** section, which allows us to provide validation for our responses to make certain they follow the required form.

## A First Route
1. The following is a simple route for a GET request on the root path. It is requesting a list of all the to-do items in a database list, so there are no parameters:
    ```yaml
    paths:
      /:
        get:
          description: "This endpoint returns all todos available in the database"
          operationId: "GetAllTodos"
          parameters: []
          responses:
            200:
              description: "An array of todos"
              schema:
                type: "array"
                  items:
                    $ref: "#/definitions/Todo"
          x-swagger-router-controller: "GetAllTodos" 
    ```
    Notice a few things about the above route.
    
    a. First, the descriptions are not required, but they provide great documentation in the browser interface.
    
    b. The "operationId" field provides the name of the method in the controller that will handle calls to this endpoint.
    
    c. The **x-swagger-router-controller** property is the name of the file inside the controllers directory where the controller method is that will handle the route. The **operationId** is the name of the method in that file.
    
    d. The "responses" field tells Swagger what to expect back from the API upon a request returning with a given status. In the above case, the *schema* propeerty will be an array, and the *items* propery tells us what we can expect each item in that array to be like. This is given by reference to a definition, which will be listed in the definitions. In this case, we will have the following:

    ```yaml
    definitions:
      Todo:
        type: "object"
        properties:
          todo_id:
            type: "integer"
            description: "Id for the todo"
          todo:
            type: "string"
            description: "The todo item."
          dateCreated:
            type: "string"
            format: "date-time"
            description: "Timestamp when the todo was created. Set by server"
          author:
            type: "string"
            description: "creator or owner of the todo"
          duedate:
            type: "string"
            format: "date-time"
            description: "When the todo is due"
          completed:
            type: "boolean"
            escription: "Indicates if the todo has been completed or not"
    ```
    In the definition of a Todo, we note first that it is of type **object**. Because it is an object, we then list all the properties of the object, with the validation for each property.

## Mock Mode
1. Swagger offers a **mock mode**, which allows us to access a store of mock data for testing purposes.

2. To enter mock mode, enter the following command from the root directory:
    ```
    swagger project start -m
    ```
3. Swagger will itself provide some simple mock data for the "GET: /" path, following the schema definition. However, to provide fuller data, we can add a "mocks" folder in our api directory and place controllers in that directory that return mock data. This way, **we can create a whole layer of response to the front end while we wire up the back end.**

## Using Swagger Parameters
1. Swaggeer will put a "swagger" property on the request object that gets passed as the first parameter to a query function. The swagger property will be an object, which will have a **params** property, which will then have every parameter value on it, whether that valuse is from the query string, the path, or the body object. We can access the parameter value with the **value** property of each parameter. 

## Setting Up Swagger Manually
1. Of course we may want to set up swagger ourselves, without the command-line tool; indeed, this will be a necessity if we are adding Swagger to an existing project. Below are the stepz necessry to do so (assuming a Node/Express app:

    a. With npm, we need to install the "swagger-express-mw" dependency.
    
    b. In the app.js file, require in swagger-express-mw;
    
    c. In the app.js file, run the **create** method of the swagger-express module, with two parameters: an object assigning the current directory to the *appRoot* property, and a callback function, taking "err" and "swaggerExpress" objects as parameters. The second parameter will have a *register()* method which will take our Express app as a parameter. In sum, the file might look something like:
    ```javascript
    'use strict';

    const SwaggerExpress = require('swagger-express-mw');
    const app = require('express')();
    const cors = require('cors');

    const config = {
        appRoot: __dirname
    };

    SwaggerExpress.create(config, function(err, swaggerExpress) {
        if (err) {
            throw err;
        }
        app.use(cors());
        swaggerExpress.register(app);

        var port = process.env.PORT || 3000;
        app.listen(port);
    });
    
    module.exports = app; // for testing
    ```
    d. Under the root directory, we should set up **api**, and **config** directories. Inside the former should be the following folders: **controllers**, **mocks**,  and **swagger**.
    
    e. In our *config* directory, include a file, **default.yaml**, with the following code:
    ```yaml
    # swagger configuration file
    # values in the swagger hash are system configuration for swagger-node
    swagger:

      fittingsDirs: [ api/fittings ]
      defaultPipe: null
      swaggerControllerPipe: swagger_controllers  # defines the standard processing pipe for controllers

    # values defined in the bagpipes key are the bagpipes pipes and fittings definitions
    # (see https://github.com/apigee-127/bagpipes)
    bagpipes:

      _router:
        name: swagger_router
        mockMode: false
        mockControllersDirs: [ api/mocks ]
        controllersDirs: [ api/controllers ]

      _swagger_validate:
        name: swagger_validator
        validateResponse: true

      # pipe for all swagger-node controllers
      swagger_controllers:
        - onError: json_error_handler
        - cors
        - swagger_security
        - _swagger_validate
        - express_compatibility
        - _router

      # pipe to serve swagger (endpoint is in swagger.yaml)
      swagger_raw:
        name: swagger_raw
    ```
    **NOTE**: for now, just cut and paste. We'll figure out what it means later.
    
    f. In the **swagger** folder, include the file, **swagger.yaml**, which will be our big, official, swagger file.
    
## Miscellaneous Syntax Rules
1. Swagger offers tremendous advantages in allowing the front-end and back-end of an application to have a single, easy-to-review interface. However, that comes at the expense of having to follow a very rigid syntax scheme, in which a single errant space can blow up the api server into a torrent of indecipherable error messages. The following is a somewhat random list of suggestions, as well as rules to follow in putting together the Swagger file. Most of these tips cost hours spent screaming at the Swagger editor or Stack Overflow to obtain, so keep them in mind.

##### If a request body is in JSON, use a single parameter with "in: body". If it is form data, you will have several parameters, each with "in: formData".

##### If the parameter is "in: body", then a "schema" object is required.

##### Parameters must have an "in" property, telling swagger where the parameter is found. It can be "body", "query", "path", "formData".

