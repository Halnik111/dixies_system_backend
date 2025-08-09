import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from "mongoose";
import tableRoutes from "./routes/tables.js"
import authRoutes from "./routes/auths.js";
import orderRoutes from './routes/orders.js';
import mealRoutes from './routes/meals.js';
import {Server} from 'socket.io';
import { createServer } from 'http';
import {closeTable} from "./controllers/table.js";
import {authorizeRoles, verifyToken} from "./middleware/verifyToken.js";
import * as http from "node:http";


const corsOptions ={
  origin: process.env.URL,
  credentials: true,
  allowCredentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
    }
});

const connect = () => {
  mongoose.connect(process.env.MONGO)
      .then(() => {
        console.log("DB Connected!");
      })
      .catch(err => {
        throw err;
      });
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use("/tables", tableRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/meals', mealRoutes);
app.get('/', (req, res) => {res.status(200).json('Working!!!')});
app.get('/dashboard', verifyToken, authorizeRoles('User', "Manager", "Admin"), (req, res) => {
    res.status(200).json('Dashboard');
});
app.get('/settings', verifyToken, authorizeRoles('User', "Manager", "Admin"), (req, res) => {
    res.status(200).json('Settings');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(socket.id);

    socket.on("tableChange", (data) => {
        console.log(data);
        io.emit('tableChanged', data);
    });

    socket.on("closeTable", (data => {
        console.log(data);
        io.emit('tableClosed', data)
    }));
});

server.listen(process.env.PORT || 8080, () => {
    connect();
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
