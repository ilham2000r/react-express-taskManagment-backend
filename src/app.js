const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app