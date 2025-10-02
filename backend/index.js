const express = require('express')
const cors = require("cors")

const multer = require('multer')

const swaggerDocs = require('./swagger/swagger')

const app = express()

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images
app.use(express.static('public'))

// File upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ message: err.message })
  }
  next(err)
})


// Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

// Swagger
swaggerDocs(app)

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000)