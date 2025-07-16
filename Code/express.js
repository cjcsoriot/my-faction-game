// Express.js exemple rapide à mettre sur ton serveur (Node.js)
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

app.get('/map.json', (req, res) => {
  fs.readFile('map.json', (err, data) => {
    if (err) return res.status(404).json({error: 'Not found'})
    res.type('json').send(data)
  })
})
app.post('/map.json', (req, res) => {
  fs.writeFile('map.json', JSON.stringify(req.body), err => {
    if (err) return res.status(500).json({error: 'Save error'})
    res.json({ok: true})
  })
})

app.listen(3001, () => console.log('API ok http://localhost:3001'))
