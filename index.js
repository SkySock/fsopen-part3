const express = require("express")
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 8000

let persons = [
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

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = +request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        return response.json(person)
    }
    response.sendStatus(404)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = +request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.sendStatus(204)
})

app.post("/api/persons", (request, response) => {
    let name = request.body.name
    let number = request.body.number

    if (!name || !number) {
        return response.status(400).json({ error: "name or number misstake" })
    }
    if (persons.find(p => p.name === name)) {
        return response.status(400).json({ error: "name must be unique" })
    }
    const newPerson = { 
        "id": Math.round(Math.random() * 1000000000),
        name, 
        number
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.patch("/api/persons/:id", (request, response) => {
    const id = +request.params.id
    let person = persons.find(person => person.id === id)
    if (!person) {
        return response.sendStatus(404)
    }
    person.number = request.body.number
    response.status(200).json(person)
})

app.get("/info", (request, response) => {
    let date = new Date()
    let result = `<p>PhoneBook has info for ${persons.length} people</p><p>${date.toString()}</p>`
    response.send(result)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})