const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res, next) => {
    res.json({
        status: 'success',
        data: {
            user: { name: 'Jean', age: 45 }
        }
    })
})

app.listen(PORT, () => {
    console.log('Started on port: ' + PORT)
})

module.exports = app
