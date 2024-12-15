const express = require('express');
const { getAllTasks, 
        createTask, 
        updateTask, 
        updateTaskStatus, 
        deleteTask, 
        getTaskById 
    } = require('../controllers/task');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);
router.get('/:id', getTaskById);

module.exports = router;