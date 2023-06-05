/* eslint-disable no-console */
/* ou use the program by passing three command-line arguments (the first is the password), e.g.:
'node mongo.js yourpassword Anna 040-1234556'

If the name contains whitespace characters, it must be enclosed in quotes:
'node mongo.js yourpassword "Arto Vihavainen" 045-1232456'

If the password is the only parameter given to the program, meaning that it is invoked like this:
'node mongo.js yourpassword'
Then the program should display all of the entries in the phonebook.
*/
const mongoose = require('mongoose');

/* 1. No password given, exit */
if (process.argv.length < 3) {
    console.log('Please enter the give the password for DB as an argument');
    process.exit(1);
}

/* OK, we have password */
const password = process.argv[2];

const url = 
`mongodb+srv://evamiliczka:${password}@cluster0.btei67j.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

/* Initialise Person */
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

console.log('Process args', process.argv, 'length :', process.argv.length);


/* 2. Only password given, no more args => display list of entries */
if (process.argv.length === 3){
    console.log('No name and phone number');
    Person.find({})
        .then(result => {
            result.forEach(person  => console.log(person))
            mongoose.connection.close();
        })
}

/* 3. If more args are given, add the entry to the phoneboook */
if (process.argv.length > 3){ 
    const nameInput = process.argv[3];
    const numberInput = process.argv[4];

    const person = new Person({
        name: nameInput,
        number:numberInput,
    })

    person.save()
        .then(result => {
            console.log((result));
            console.log(`Person ${nameInput} with number ${numberInput} saved to DB`);
            mongoose.connection.close();
        })
}