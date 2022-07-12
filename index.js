import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import blogRoutes from './routes/blogs.js'
import productRoutes from './routes/products.js'
import userRoutes from './routes/user.js'
import dotenv from 'dotenv'

const app = express()
dotenv.config()
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use('/blog', blogRoutes)
app.use('/product', productRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('This is API server for Evento Clone Project')
})
app.use(express.static('assets'))
const CONNECTION_URL = 'mongodb+srv://hieu081011:hieungo123@cluster0.zj6jf.mongodb.net/?retryWrites=true&w=majority'
var PORT = process.env.PORT || 8000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

