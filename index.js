import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from "mongoose";
import tableRoutes from "./routes/tables.js"
import authRoutes from "./routes/auths.js";
import orderRoutes from './routes/orders.js';
import mealRoutes from './routes/meals.js';
import { createServer } from "http";
import {Server} from 'socket.io';
import {closeTable} from "./controllers/table.js";


const corsOptions ={
  origin: process.env.URL,
  credentials: true,
  allowCredentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

const app = express();

const connect = () => {
  mongoose.connect(process.env.MONGO_RAIL)
      .then(() => {
        console.log("DB Connected!");
      })
      .catch(err => {
        throw err;
      })
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use("/tables", tableRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/meals', mealRoutes);
app.get('/', (req, res) => {res.status(200).json('Working!!!')});

const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    }
});


io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(socket.id);

    socket.on("openTable", (data) => {
        console.log(data);
        io.emit('tableOpened', data);
    });

    socket.on("closeTable", (data => {
        console.log(data);
        io.emit('tableClosed', data)
    }))

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Connected!");
    connect();
});

httpServer.listen(process.env.PORT || 8090);
