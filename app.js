const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const { token } = require('./middleware/token');
const { checkTeacher, checkStudent, checkAdmin } = require('./middleware/checkRole');
require('dotenv').config()

const app = express()

// Connect to MongoDB
mongoose.connect(process.env.DB_global_link)
// mongoose.connect(process.env.DB_local_link)
    .then(data => {
        if (data) {
            console.log("DB connected...");
        }
    })
    .catch(err => {
        console.log(err);
    })

// Cors
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Get information for use
app.use('/', require('./routes/index'))

// SignIn and SignUp
app.use('/auth', require('./routes/auth/auntification'))

// Teacher panel
// app.use('/routeTeacher', token, checkTeacher, require('./routes/route/routeTeacher')) // correct

app.use('/supadmin', token, checkAdmin, require('./routes/path/supadmin'))
app.use('/admin', token, checkTeacher, require('./routes/path/admin'))
app.use('/students', token, checkStudent, require('./routes/path/students'))

app.use('/groups', token, checkTeacher, require('./routes/path/groups'))

app.use('/prof', token, require('./routes/path/prof'))

// Connect to port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Running: ${PORT}`))