const express = require('express')
const mongoose = require('mongoose')
const contactRouter = require('./routes/contactRoutes')

const app = express()
const PORT = 8000

app.use(express.json())

mongoose.connect('mongodb+srv://surajkr759:z9JtenHwLJl5H1wU@cluster0.trccycl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected...'))
.catch((error) => console.log('Internal server error ' , error))


app.use('/contacts', contactRouter)


app.listen(PORT, () => console.log('Server connected...'))