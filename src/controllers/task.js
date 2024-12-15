const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get tasks',
      details: error.message 
    })
  }
}

exports.createTask = async (req, res) => {
  try {
    const { taskName, description, dueDate, priority } = req.body
    const validDate = new Date(dueDate);

    if (isNaN(validDate)) {
      // ตรวจสอบว่าเป็นวันที่ที่ถูกต้องหรือไม่
      return res.status(400).json({ error: "Invalid date format" });
    }

    const task = await prisma.task.create({
      data: {
        taskName,
        description,
        dueDate: validDate,
        priority,
        userId: req.user.id
      }
    })
    
    console.log("create task succesfully");
    
    res.status(201).json({
      message:"create task succesfully",
      task
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message 
    })
  }
}

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { taskName, description, dueDate, priority } = req.body
    
    const task = await prisma.task.update({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      },
      data: {
        taskName,
        description,
        dueDate: new Date(dueDate),
        priority
      }
    })
    
    console.log("update task successfully");
    
    res.json({
      message: "update task successfully",
      task})
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update task',
      details: error.message 
    })
  }
}

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const task = await prisma.task.update({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      },
      data: { status }
    })
    
    res.json({
      message: "status updated",
      task
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update task status',
      details: error.message 
    })
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.task.delete({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    })
    
    res.json({ message: 'task deleted successfully' })
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete task',
      details: error.message 
    })
  }
}

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    
    const task = await prisma.task.findUnique({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    })
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json(task)
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch task',
      details: error.message 
    })
  }
}