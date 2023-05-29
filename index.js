const express = require('express');
const cors = require ('cors');

/*express, which this time is a 
function that is used to create an express application stored in the app variable: */
const app = express();

app.use(express.json());
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));
app.use(cors());




let persons =
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Event handler for apps root
app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})



app.get('/api/persons', (request, response) => response.json(persons))

app.get('/api/persons/:id', (request, response) => {
    console.log('request.params: ', request.params);
    const id = Number(request.params.id);
    const person  = persons.find(p => p.id === id);
    if (person)
        response.json(person)
    else    
        response.status(404).end(); 
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
    console.log(body.content);
    if (!body.name){      
        return    response.status(400).json({error: 'name missing'})
    }
    if (!body.number){      
        return    response.status(400).json({error: 'number missing'})
    }

    if (persons.find(p => p.name === body.name)){
        return    response.status(400).json({error: 'person already exists'})

    }

    const person = {
        name : body.name,
        number : body.number,
        id : Math.floor(Math.random()*100)
    }

    persons = persons.concat(person);
    response.json(person)
})

const PORT = process.env.PORT || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);