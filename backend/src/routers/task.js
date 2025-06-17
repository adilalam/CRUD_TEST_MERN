const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).send("Task name is required");
    }

    const task = new Task({
        name,
        userId: req.user._id
    })

    try {
        await task.save()
        res.status(201).send({data: task, message: 'Task is created'})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ _id: -1 });
        
        if (tasks.length === 0) {
            res.send({ data: [], message: 'No tasks found.' });
        }
        res.send({ data: tasks, message: 'Get all tasks.' });
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id },);
        if (!task) {
            res.send({ data: {}, message: 'Task not found.' })
            return null;
        }

        // Toggle the completed value
        task.completed = !task.completed;
        await task.save();

        res.send({ data: task, message: 'Updated task.' })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

        if (!task) {
            res.send({ data: {}, message: 'Task not found.' })
            return null;
        }

        res.send({ data: task, message: 'Deleted task successfully' })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router