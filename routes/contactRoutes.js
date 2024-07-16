const express = require('express')
const { handleGetAllContacts, handleAddContact, handleDeleteContact, handleSearchCategory, handleSearchContact, handleUpdateContact } = require('../controllers/contactController')

const router = express.Router()

router.get('/getContacts', handleGetAllContacts)
router.get('/searchContact', handleSearchContact)
router.get('/searchCategory', handleSearchCategory)
router.post('/addContact', handleAddContact)
router.delete('/deleteContact', handleDeleteContact)
router.put('/updateContact', handleUpdateContact)

module.exports = router