const express = require('express');
const router = express.Router();
const { Document, validateData, validateObjectId } = require('../models/document');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin');
const asyncMiddleware = require('../middlewares/async');

//get all documents in the collection
router.get('/', async (req, res, next) => {
  const document = await Document.find().sort('name');
  res.send(document);
});

//add a document to the collection added middlware auth to protect the route

router.post('/', auth, async (req, res) => {
  const { error } = validateData(req.body)
  if (error) return res.status(400).send(error.details[0].message);
  let document = new Document({ name: req.body.name })
  document = await document.save();
  res.send(document);
});

//get a specific document
router.get('/:id', auth, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).send("Invalid document id");
  const document = await Document.findById(req.params.id);
  console.log('doc', document)
  if (!document) return res.status(404).send('The document with the given id is not found!');
  res.send(document);
})

//update specific collection
router.put('/:id', auth, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).send("Invalid document id");
  const { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const document = await Document.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  if (!document) return res.status(404).send('The document with the given id is not found!')
  res.send(document)
});


//delete a document admin only
router.delete('/:id', [auth, admin], async (req, res) => {
  const document = await Document.findByIdAndRemove(req.params.id);
  if (!document) res.status(404).send('The document with the given id is not found!');
  res.send(document);
});


module.exports = router;