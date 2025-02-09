import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'; 

// App Config
const app = express()
const startPort = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter); 

app.get('/',(req,res)=>{
    res.send('API Working')
})

// Function to try different ports if the initial port is in use
const startServer = (port) => {
    try {
        app.listen(port, () => console.log('Server started on PORT: ' + port))
    } catch (error) {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`)
            startServer(port + 1)
        } else {
            console.error('Error starting server:', error)
        }
    }
}

// Start the server with error handling
const server = app.listen(startPort)
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} is busy, trying ${startPort + 1}...`)
        server.close()
        startServer(startPort + 1)
    } else {
        console.error('Error starting server:', error)
    }
})