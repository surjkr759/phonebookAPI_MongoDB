const Contact = require('../models/contactModel')

exports.handleGetAllContacts = async (req, res) => {
    const user = await Contact.find({})
    return res.json({status: 'success', data: user})
}

exports.handleSearchContact = async (req, res) => {
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
}


exports.handleSearchCategory = async (req, res) => {
    const query = req.query.q
    const user = await Contact.find({category: query})

    if(user.length > 0)
        return res.status(200).json({status: 'success', message: 'Data Found', data: user})
    return res.status(404).json({status: 'error', message: 'No such category found'})
}


exports.handleAddContact = async (req, res) => {
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
}


exports.handleDeleteContact = async (req, res) => {
    const id = req.query.q
    const user = await Contact.findById(id)

    if(!user)
        return res.status(404).json({ status: 'error', message: 'Contact not found'})

    await Contact.findByIdAndDelete(id)
    return res.status(200).json({status: 'success', message: 'Contact Deleted'})
}


exports.handleUpdateContact = async (req, res) => {
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
}