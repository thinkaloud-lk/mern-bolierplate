const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

// common mongoose model creation
const Document = mongoose.model('Document', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  }
}))

//get all documents in the collection
router.get('/', async (req, res) => {
  const document = await Document.find().sort('name');
  res.send(document);
});

//add a document to the collection

router.post('/', async (req, res) => {
  const { error } = validateData(req.body)
  if (error) return res.status(400).send(error.details[0].message);
  let document = new Document({ name: req.body.name })
  document = await document.save();
  res.send(document);
});

//get a specific document 

router.get('/:id', async (req, res) => {
  const document = await Document.findById(req.params.id);
  console.log('doc', document)
  if (!document) return res.status(404).send('The document with the given id is not found!');
  res.send(document);
})

//update specific collection
router.put('/:id', async (req, res) => {
  const { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const document = await Document.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  if (!document) return res.status(404).send('The document with the given id is not found!')
  res.send(document)
});


//delete a document

router.delete('/:id', async (req, res) => {
  const document = await Document.findByIdAndRemove(req.params.id);
  if (!document) res.status(404).send('The document with the given id is not found!');
  res.send(document);
});

//validate request data

const validateData = (data) => {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  }
  return Joi.validate(data, schema);
}

module.exports = router;