const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Весёлый Роджер',
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Storm of the seas',
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default:
        'https://st.depositphotos.com/1033409/2954/i/600/depositphotos_29548213-stock-photo-jolly-roger.jpg',
    },
  },
  {
    toObject: {
      versionKey: false,
    },
  },
  {
    toObject: {
      versionKey: false,
    },
  },
);

module.exports = mongoose.model('user', userSchema);
