
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const productsRouter = require('./routes/products')

app.use(express.json())//not required 

app.use('/api/v1/products',productsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port  = process.env.PORT || 5000


const start = async() => {
       try{
           await  connectDB(process.env.MONGO_URI)
           app.listen(port, () => console.log(`App listening to port ${port}...`))
       }catch(error){
           console.log(error)
       }
}

start()