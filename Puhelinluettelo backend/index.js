const express = require('express')
require('dotenv').config()
const app = express()
const Person = require('./models/person.js')
app.use(express.static('dist'))
app.use(express.json())

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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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

  const person = new Person ({
    name: body.name,
    number: body.number,
    id: generateId(),
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})