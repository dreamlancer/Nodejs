const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const informationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  contact_no: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    postal_code: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
  },
  birthday: {
    type: Date,
    default: ''
  },
  age: {
    type: Number,
    default: 0
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
      type: Number,
      default: 0
  }
});

module.exports = Information = mongoose.model('Information', informationSchema);
