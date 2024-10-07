const express = require('express');
const Task = require('../models/task');
const createPath = require('../helpers/create-path');
const router = express.Router();
const { getTask, getCreateTask, postCreateTask, getEditTask, postEditTask, ChangTaskStatus, deleteTask } 
= require('../controllers/task-controller');




router.get('/', getTask);

router.get('/task/create', getCreateTask);
router.post('/task/create', postCreateTask);

router.get('/task/edit/:id', getEditTask);
router.post('/task/edit/:id', postEditTask);

router.get('/task/changestatus/:id', ChangTaskStatus);

router.get('/task/delete/:id', deleteTask);

module.exports = router;
