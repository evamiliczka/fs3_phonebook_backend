//This is a Node module, not ES6 modules, as the others
const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

//console.log('URL is', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB on port ', process.env.PORT);
    })
    .catch(error => {
        console.log('Error connecting to MongoDB ', error.message);
    })


/*Initialise Person*/
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})


module.exports = mongoose.model('Person', personSchema)
