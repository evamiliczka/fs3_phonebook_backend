const express = require('express');
const app = express();
const cors = require ('cors');
require('dotenv').config();
//console.log('Process env is ', process.env);

const Person = require('./models/person');


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Sorry, unknown endpoint' })
}

const errorHandler = (error, request, response, next)   => {
  console.error('Error handler: ', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error : 'Malformed id'})
  }
  next(error)
} 

app.use(cors());
app.use(express.json());
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));


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

app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
      .then(person => {
        //person found
        if (person) {response.json(person)}
        else {
          console.log('Person not found');
          response.status(404).end()}
      })
      //Dafault Express handling => 500 Internal Server Error
      /*.catch(error => {
        console.log(error);
        response.status(500).end();
      })*/
      .catch(error => next(error)
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

app.use(unknownEndpoint)
app.use(errorHandler);

const PORT = process.env.PORT; // || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);