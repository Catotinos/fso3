const express = require('express')
var morgan = require('morgan')
require('dotenv').config()
const d = new Date()
const app = express()
const Person = require('./models/person.js')
app.use(express.static('dist'))
app.use(express.json())

app.use(morgan(':method :url :status :req[content-length] :response-time ms :req'))
morgan.token('req', function getContent (request) {
  return JSON.stringify(request.body)
})
let persons = [
  {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "2"
    },
    {
      "id": "3",
      "name": "Janne koskela",
      "number": "040-5473176"
    },
    {
      "id": "4",
      "name": "Ville Kumpumäki",
      "number": "040-4627625"
    },
    {
      "id": "5",
      "name": "Toivo Paasanen",
      "number": "040-6742546"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})
app.get('/info', (request, response) => {
  response.write('<p>Phonebook has info for' + " " + persons.length + ' people' + '</p>')
  response.write('<p>'+ d +'</p>')
  response.send()
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(persons)
  persons = persons.filter(person => person.name !== id)
  
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  
  for (var i = 0; i < persons.length; i++) {
    console.log(persons[i].name)
    if(persons[i].name.toLowerCase() == body.name.toLowerCase()){
        return response.status(400).json({ 
      error: 'person with that name already exists' 
    })
    }else if(persons[i].number == body.number)
        return response.status(400).json({ 
      error: 'person with that number already exists' 
    })
    }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})