const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = 8000

app.use(express.json())

mongoose.connect('mongodb+srv://surajkr759:z9JtenHwLJl5H1wU@cluster0.trccycl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected...'))
.catch((error) => console.log('Internal server error ' , error))


const phonebookSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Contact = mongoose.model('contacts', phonebookSchema)


app.get('/', (req, res) => {
    return res.json({message: 'Test connection'})
})


app.post('/addContact', async (req, res) => {
    const { firstName, lastName, phoneNo, category } = req.body

    const existingContact = await Contact.findOne({ firstName, lastName })
    if(existingContact)
        return res.status(400).json({status: 'error', message: 'Person already exists'})

    try {
        const user = await Contact.create({
            firstName,
            lastName,
            phoneNo,
            category
        })
        console.log('User: ', user)
        return res.json({status : 'success', data: user})
    } catch(error) {
        if(error.code === 11000)
            return res.status(400).json({status: 'error', message: 'Phone number already exists'})
        return res.status(500).json({status: 'error', message: 'Internal server error'})
    }
})


app.get('/contacts', async (req, res) => {
    const user = await Contact.find({})
    return res.json({status: 'success', data: user})
})


app.get('/searchContact', async (req, res) => {
    const query = req.query.q
    const user = await Contact.find({
        $or : [
            { firstName: {$regex : query, $options: 'i'}},
            { lastName : {$regex : query, $options: 'i'}},
            { phoneNo: {$regex: query, $options: 'i'}}
        ]
    })

    if(user.length > 0)
        return res.status(200).json({status: 'success', data: user})
    return res.status(404).json({status: 'error', message: 'Contact not found'})
})


app.delete('/deleteContact', async (req, res) => {
    const id = req.query.q
    const user = await Contact.findById(id)

    if(!user)
        return res.status(404).json({ status: 'error', message: 'Contact not found'})

    await Contact.findByIdAndDelete(id)
    return res.status(200).json({status: 'success', message: 'Contact Deleted'})
})


app.put('/updateContact', async (req, res) => {
    const { _id, firstName, lastName, phoneNo, category } = req.body
    const contact = await Contact.findById(_id)

    console.log('User', contact)

    if(!contact)
        return res.status(404).json({ status: 'error', message: 'Contact not found'})

    const updatedContact = await Contact.findByIdAndUpdate(
        _id,
        { firstName, lastName, phoneNo, category },
        {new : true}    //This option returns the updated document
    )
    return res.status(200).json({status: 'success', message: 'Contact Updated', data: updatedContact})
})


app.get('/searchCategory', async (req, res) => {
    const query = req.query.q
    const user = await Contact.find({category: query})

    if(user.length > 0)
        return res.status(200).json({status: 'success', message: 'Data Found', data: user})
    return res.status(404).json({status: 'error', message: 'No such category found'})
})


app.listen(PORT, () => console.log('Server connected...'))