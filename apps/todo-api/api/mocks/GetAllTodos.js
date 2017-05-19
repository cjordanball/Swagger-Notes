'use strict';

var util = require('util');

const GetAllTodos = (req, res, next) => {
	res.json([
		{
			todo_id: 0,
			todo: 'Wipe my ass',
			dateCreated: '2017-05-18T23:15:00.000Z',
			author: "Jim",
			duedate: "2017-07-12T08:00:00.000Z",
			completed: false
		},
		{
			todo_id: 1,
			todo: 'Wipe my nose',
			dateCreated: '2017-05-18T23:15:00.000Z',
			author: "Jordan",
			duedate: "2017-07-12T08:00:00.000Z",
			completed: true
		}
	]);

}


module.exports = {
	GetAllTodos
};
