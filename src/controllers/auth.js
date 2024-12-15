const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ 
      where: { username } 
    })

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user.id 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { username } 
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password, 
      user.password
    )

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ 
      status: "login successfully",
      token, 
      userId: user.id 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    })
  }
}