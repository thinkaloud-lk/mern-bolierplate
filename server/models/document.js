const mongoose = require('mongoose');
const Joi = require('joi');

// common mongoose model creation
const Document = mongoose.model('Document', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  }
}))


const validateData = (data) => {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  }
  return Joi.validate(data, schema);
}

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

exports.Document = Document;
exports.validateData = validateData;
exports.validateObjectId = validateObjectId;
