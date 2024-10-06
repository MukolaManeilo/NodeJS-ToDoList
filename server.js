const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Task = require('./models/tasks');
// -------------------------init------------------------------------
const app = express();

const PORT = 3000;
const db = 'mongodb+srv://kolamanejlo:rXmomGpC4IgcWhI2@cluster0.6ydhe.mongodb.net/ToDoList?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(db)
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error));

app.set('view engine', 'ejs');
// -----------------------middleware---------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// -------------------------start------------------------------------


app.listen(PORT, (error => {
    error ? console.log(error) : console.log('http://localhost:' + PORT);
}));

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

// -----------------------/index-------------------------------------

app.get('/', (req, res) => {
    const pageTitle = 'Home';

    Task
    .find()
    .then(tasks => {
        res.render(createPath('index'), { pageTitle, tasks });
    })
    .catch(err => {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Error fetching tasks');
    });
});
// ------------------------/edit-------------------------------------
// app.get('/task/edit/:id', (req, res) => {
//     const pageTitle = 'Edit';
//     const taskId = req.params.id;
//     res.render(createPath('edit'), {pageTitle, taskId});
// });


app.get('/task/edit/:id', (req, res) => {
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

app.post('/task/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, type, desc } = req.body;

    // Оновлення задачі
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
// ------------------------/changeStatus------------------------------------
app.get('/task/changestatus/:id', (req, res) => {
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
// ------------------------/create------------------------------------
app.get('/task/create', (req,res) => {
    const pageTitle = 'Home';
    const title = 'Create';
    res.render(createPath('create'), {pageTitle});
});

app.post('/task/create', (req, res) => {
    const pageTitle = 'Home';
    const {title, type, desc} = req.body;
    const task = new Task({title: title, type, desc, status: false })
    task
        .save()
        .then(res.redirect('/'))
        .catch((error) => {console.log(error)});
});
// ------------------------/delete------------------------------------
app.get('/task/delete/:id', (req, res) => {
    const taskId = req.params.id;
    Task
    .findByIdAndDelete(taskId)
    .then(() => res.redirect('/'))
    .catch(error => {
        console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
    });
});

// ------------------------/errorMiddleware----------------------------
app.use((req, res) => {
    const pageTitle = 'error';
    res
        .status(404)
        .render(createPath('error'), {pageTitle});
})