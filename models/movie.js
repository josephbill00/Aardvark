//Require mongoose
var mongoose = require('mongoose');

//define our schema
var movieSchema = mongoose.Schema({
  title: String,
  year_of_release: Number,
  category: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 12
  }
});

//compile our model
module.exports = mongoose.model('Movie', movieSchema);