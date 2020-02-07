const express = require('express');
const router = express.Router();
const { Document, validateData, validateObjectId } = require('../models/document');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin');
const asyncMiddleware = require('../middlewares/async');

//get all documents in the collection
router.get('/', async (req, res, next) => {
  const document = await Document.find();
  res.send(document);
});

//get documents wrt given sort and filter use find method
router.get('/', async (req, res, next) => {
  const document = await Document.find()
  //.sort({name: 1} ); asceding order
  //.sort({name: -1}) : descending order
  //.find({ name: 'Somthing", isSomthing: true })
  //.select({name:1, somthing: 1 })  to select only name and somthing properties our of the document
  res.send(document);
});

//get documents with comparison operators
router.get('/', async (req, res, next) => {
  //# eq (equal)
  //# ne (not equal)
  //# gt (greater than)
  //# gte (greater than or equal to)
  //# lt (less than)
  //# lte (less than or equal to)
  //# in 
  //# nin (not in)
  const document = await Document.find({
    name: { $gt: 10 },
    name: { $gte: 10, $lte: 20 },
    name: { $in: [10, 15, 20] } // get documents on which the name property equals to 10, 15 or 20
  })
  res.send(document);
});

//get documents with logical query operators
router.get('/', async (req, res, next) => {
  //# or
  //# and
  const document = await Document.find()
  //or([{name: '' },{somthing: true }])  each object is a filter
  //and()
  res.send(document);
});

//get documents with regular expresions
router.get('/', async (req, res, next) => {
  const document = await Document.find({
    // name: /pattern/ 
    // name: /^China/  starts with China
    // name: /Kody$/   ends with kody
  })
  res.send(document);
});

//get  the number of documents
router.get('/', async (req, res, next) => {
  const document = await Document.find().count()
  res.send(document);
});

//pagination
router.get('/', async (req, res, next) => {
  const pageNumber = 2;
  const pageSize = 10;
  // typically gets above thru query parameters api/collecitons?pageNumber=2&PageSize=10
  const document = await Document.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
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

//update specific document=> query first method
router.put('/:id', auth, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).send("Invalid document id");
  const document = await Document.findById(req.params.id, { name: req.body.name })
  if (!document) return res.status(404).send('The document with the given id is not found!')
  const { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //update properties
  //document.someProperty = something
  // or use set method to update more than one properties
  //document.set({ <properties> })
  const result = await document.save()
  res.send(result)
});

//update  documents
router.put('/:id', auth, async (req, res) => {
  //mongodb update operators to change the value of a property directly
  // $currentDate: sets the current date
  // $inc
  // https://docs.mongodb.com/manual/reference/operator/update/
  if (!validateObjectId(req.params.id)) return res.status(400).send("Invalid document id");
  //const { error } = validateData(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  const document = await Document.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        //update some fields
      },
      $inc: {
        prop: 2,
      }
    },
    {
      new: true // to get the updated document. otherwise returns the older document
    }
  )

  res.send(document)
});

//delete a document admin only
router.delete('/:id', [auth, admin], async (req, res) => {
  const document = await Document.findByIdAndRemove(req.params.id);
  if (!document) res.status(404).send('The document with the given id is not found!');
  res.send(document);
});


module.exports = router;