import 'dotenv/config'
import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import path from 'path'
import { fileURLToPath } from 'url'

import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import menuRouter from "./routes/menuRoutes.js"
import deliveryBoyRouter from "./routes/deliveryBoyRoutes.js"
import orderSocket from './sockets/orderSocket.js'

// ✅ REMOVED: import paymentRoutes from "./routes/paymentRoutes.js"
// ✅ REMOVED: Razorpay is fully replaced by Stripe (used in orderController.js)

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Static uploads folder
app.use("/images", express.static(path.join(__dirname, 'uploads')))

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/food",        foodRouter)
app.use("/api/user",        userRouter)
app.use("/api/cart",        cartRouter)
app.use("/api/order",       orderRouter)
app.use("/api/bookings",    bookingRoutes)
app.use("/api/admin",       adminRoutes)       // ✅ Now protected with JWT + adminOnly
app.use("/api/category",    categoryRoutes)
app.use("/api/menu",        menuRouter)
app.use("/api/deliveryboy", deliveryBoyRouter)
// ✅ REMOVED: app.use("/api/payment", paymentRoutes)  — Stripe handles payment via /api/order/place

connectDB()

app.get("/", (req, res) => res.send("API working"))

// HTTP + Socket.io
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:5174",
        methods: ["GET", "POST"]
    }
})

orderSocket(io)

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})