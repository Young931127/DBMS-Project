const { Router } = require("express");
const { getNormalTasks, getTopTasks } = require("../Controllers/taskController");

Router.get('/',getNormalTasks);
Router.get('/',getTopTasks);