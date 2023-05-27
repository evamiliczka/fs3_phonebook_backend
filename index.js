const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())


morgan.token('host', (req, res) =>  req.headers['host'] )
//morgan.token('response',  (req, response)  => {return(JSON.stringify(Object.keys(response))) })

app.use(morgan(`Server running on port :host  
:method :url :status :res[content-length]  - :response-time ms`))

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
    response.send(`<h1>Please go to  
           <a href="http://localhost:3001/api/persons">http://localhost:3001/api/persons </a> or
           <a href="http://localhost:3001/info">http://localhost:3001/info </a></h1>`)
})

app.get('/info', (request, response) => {
    response.send(`The phone book has ${persons.length} entries <br><br> ${new Date()} `)
    
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





const PORT = 3001
app.listen(PORT)