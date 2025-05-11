import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();  // connects to mongodb
await connectCloudinary();  // connects to cloudinary

//Allowed Origins
const allowedOrigins = ['http://localhost:5174'] 

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

//Middleware Confg
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res)=> res.send('API Working'));
app.use('/api/user', userRouter)   //User Routes
app.use('/api/seller', sellerRouter)   //Seller Routes
app.use('/api/product', productRouter)  //Product Routes
app.use('/api/cart', cartRouter)  //Cart Routes
app.use('/api/address', addressRouter)  //Address
app.use('/api/order', orderRouter)  //Orders

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})