const Task = require('../models/task');
const createPath = require('../helpers/create-path');

const getTask = (req, res) => {
    console.log("Цей код виконується при завантаженні файлу");
    const pageTitle = 'Home';

    Task.find()
        .then(tasks => {
            res.render(createPath('index'), { pageTitle, tasks });
        })
        .catch(err => {
            console.error('Error fetching tasks:', err);
            res.status(500).send('Error fetching tasks');
        });
};

const getCreateTask = (req, res) => {
    const pageTitle = 'Create';
    res.render(createPath('create'), { pageTitle });
};

const postCreateTask = (req, res) => {
    const { title, type, desc } = req.body;
    const task = new Task({ title, type, desc, status: false });

    task.save()
        .then(() => res.redirect('/'))
        .catch(error => {
            console.error('Error saving task:', error);
            res.status(500).send('Error creating task');
        });
};

const getEditTask = (req, res) => {
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
};

const postEditTask = (req, res) => {
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
};

const ChangTaskStatus = (req, res) => {
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
};

const deleteTask = (req, res) => {
    const taskId = req.params.id;

    Task.findByIdAndDelete(taskId)
        .then(() => res.redirect('/'))
        .catch(error => {
            console.error('Error deleting task:', error);
            res.status(500).send('Error deleting task');
        });
};


module.exports = {
    getTask,
    getCreateTask,
    postCreateTask,
    getEditTask,
    postEditTask,
    ChangTaskStatus,
    deleteTask
}