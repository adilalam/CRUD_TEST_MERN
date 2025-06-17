require('dotenv').config();
const express = require('express')
const cors = require('cors');
const connectDB = require('./db/mongoose')

const userRouter = require('./routers/user')
const todoRouter = require('./routers/task')

const app = express()

app.use(cors({
    origin: '*',
}));

const port = process.env.PORT;

app.use(express.json())
app.use(userRouter)
app.use(todoRouter)

app.listen(port, async() => {
    // first connect mongodb
    await connectDB();
    // then run the server
    console.log('Server is up on port ' + port)
})