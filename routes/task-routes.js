const express = require('express');
const Task = require('../models/task');
const createPath = require('../helpers/create-path');

const ensureAuthenticated = require('../middleware/auth-middleware');
const router = express.Router();
const { getTask, getCreateTask, postCreateTask, getEditTask, postEditTask, ChangTaskStatus, deleteTask } 
= require('../controllers/task-controller');




router.get('/',ensureAuthenticated, getTask);

router.get('/task/create', ensureAuthenticated, getCreateTask);
router.post('/task/create', ensureAuthenticated, postCreateTask);

router.get('/task/edit/:id', ensureAuthenticated, getEditTask);
router.post('/task/edit/:id', ensureAuthenticated, postEditTask);

router.get('/task/changestatus/:id', ensureAuthenticated, ChangTaskStatus);

router.get('/task/delete/:id', ensureAuthenticated, deleteTask);

module.exports = router;
