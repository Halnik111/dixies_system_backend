import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from "mongoose";
import tableRoutes from "./routes/tables.js"
import authRoutes from "./routes/auths.js";
import orderRoutes from './routes/orders.js';
import tableOrderRoutes from './routes/tableOrders.js';
import mealRoutes from './routes/meals.js';
import {Server} from 'socket.io';
import {closeTable} from "./controllers/table.js";
import {authorizeRoles, verifyToken} from "./middleware/verifyToken.js";
import * as http from "node:http";
import {getAllActiveTableOrders, getAllActiveTableOrdersWithOrders} from "./controllers/tableOrder.js";
import Meal from './models/Meal.js'; // Add this import at the top


const corsOptions ={
  origin: process.env.URL,
  credentials: true,
  allowCredentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    cors: {
        origin: process.env.URL,
        credentials: true,
        
    },
});

const connect = () => {
  mongoose.connect(process.env.MONGO_NEW)
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
app.use('/tableOrder', tableOrderRoutes)
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

    socket.on("tableChange", async ({tableId}, ack) => {
        try {
            const tableOrders = await getAllActiveTableOrders();
            ack({ ok: true, tableOrders });
            io.emit('tableChanged', tableOrders);
            console.log('aaa')
        } catch (e) {
            console.log('asd')
            //ack({ ok: false, error: e.message });
        }
        
        const broadcastOrdersUpdate = async () => {
            const tableOrders = await getAllActiveTableOrdersWithOrders();
        }
    });

    socket.on("closeTable", async (ack) => {
        try {
            const tableOrders = await getAllActiveTableOrders();
            ack({ ok: true, tableOrders });
            io.emit('tableClosed', tableOrders);
        } catch (e) {
            console.log('error close table')
            //ack({ ok: false, error: e.message });
        }
    });

    socket.on("mealsChange", async (ack) => {
        try {
            const meals = await Meal.find({});
            ack({ ok: true, meals });
            io.emit('mealsChanged', meals);
        } catch (e) {
            console.log('error meals');
        }
    });
});

server.listen(process.env.PORT || 8080, () => {
    connect();
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
