require('dotenv').config();
//console.log('Process env is ', process.env);

const express = require('express');
const cors = require ('cors');
const Person = require('./models/person');

/*express, which this time is a 
function that is used to create an express application stored in the app variable: */
const app = express();

app.use(express.json());
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));
app.use(cors());

//Event handler for apps root
app.get('/', (request, response) => {
  //  console.log(request);
      response.send('<h1>Hello world</h1>')
  })



app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(person => {
      console.log(person);
      response.json(person)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
      .then(person => {
        response.json(person)
      })

})

app.delete('/api/persons/:id', (request, response) => {
    //request.params.id is a string
    const id = Number(request.params.id);
    // new list
    persons = persons.filter(p => p.id !== id);
    // no info if the deletion was successfull
    response.status(204).end();
})



app.post('/api/persons', (request, response) => {
    const body = request.body;
   // console.log(body.content);
    if (!body.name){      
        return    response.status(400).json({error: 'name missing'})
    }
    if (!body.number){      
        return    response.status(400).json({error: 'number missing'})
    }

  
    const person = new Person({
        name : body.name,
        number : body.number,
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)}
      )
})

const PORT = process.env.PORT; // || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);