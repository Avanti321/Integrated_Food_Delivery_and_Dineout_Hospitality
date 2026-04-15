const orderSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("🔌 User Connected:", socket.id);

        // Customer joins a room specific to their order
        socket.on("joinOrderRoom", (orderId) => {
            socket.join(`order_${orderId}`);
            console.log(`📦 Socket ${socket.id} joined room: order_${orderId}`);
        });

        // Delivery driver sends their live location
        // Only the customer in that order's room receives it
        socket.on("sendLocation", (data) => {
            // data = { orderId, lat, lng }
            io.to(`order_${data.orderId}`).emit("receiveLocation", {
                lat: data.lat,
                lng: data.lng
            });
        });

        // Chat system
        socket.on("sendMessage", (msg) => {
            io.emit("receiveMessage", msg);
        });

        socket.on("disconnect", () => {
            console.log("❌ User Disconnected:", socket.id);
        });
    });
};

export default orderSocket;