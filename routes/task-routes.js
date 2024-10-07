const express = require('express');
const Task = require('../models/tasks');
const createPath = require('../helpers/create-path');
const router = express.Router();

// ------------------------/index-------------------------------------
router.get('/', (req, res) => {
    const pageTitle = 'Home';

    Task.find()
        .then(tasks => {
            res.render(createPath('index'), { pageTitle, tasks });
        })
        .catch(err => {
            console.error('Error fetching tasks:', err);
            res.status(500).send('Error fetching tasks');
        });
});

// ------------------------/create------------------------------------
router.get('/task/create', (req, res) => {
    const pageTitle = 'Create';
    res.render(createPath('create'), { pageTitle });
});

router.post('/task/create', (req, res) => {
    const { title, type, desc } = req.body;
    const task = new Task({ title, type, desc, status: false });

    task.save()
        .then(() => res.redirect('/'))
        .catch(error => {
            console.error('Error saving task:', error);
            res.status(500).send('Error creating task');
        });
});

// ------------------------/edit-------------------------------------
router.get('/task/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const pageTitle = 'Edit';

    Task.findById(taskId)
        .then(task => {
            if (!task) {
                return res.status(404).send('Task not found');
            }
            res.render(createPath('edit'), { pageTitle, task });
        })
        .catch(error => {
            console.error('Error fetching task:', error);
            res.status(500).send('Error fetching task');
        });
});

router.post('/task/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, type, desc } = req.body;

    Task.findByIdAndUpdate(taskId, { title, type, desc }, { new: true })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).send('Task not found');
            }
            res.redirect('/');
        })
        .catch(error => {
            console.error('Error updating task:', error);
            res.status(500).send('Error updating task');
        });
});

// ------------------------/changeStatus--------------------------------
router.get('/task/changestatus/:id', (req, res) => {
    const taskId = req.params.id;

    Task.findById(taskId)
        .then(task => {
            if (!task) {
                return res.status(404).send('Task not found');
            }

            task.status = !task.status;

            return task.save();
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
            console.error('Error changing task status:', error);
            res.status(500).send('Error changing task status');
        });
});

// ------------------------/delete--------------------------------------
router.get('/task/delete/:id', (req, res) => {
    const taskId = req.params.id;

    Task.findByIdAndDelete(taskId)
        .then(() => res.redirect('/'))
        .catch(error => {
            console.error('Error deleting task:', error);
            res.status(500).send('Error deleting task');
        });
});

module.exports = router;
