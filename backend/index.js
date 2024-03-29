const app = require("express")();
const server = require("http").createServer(app);
const Redis = require("ioredis");

const redisSubscriber = new Redis();
const redisPublisher = new Redis(); // New Redis instance for publishing

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

redisSubscriber.subscribe("MESSAGE-CHANNEL", (err, count) => {
  if (err) {
    console.error("Error subscribing to MESSAGE-CHANNEL in redis:", err);
  } else {
    console.log(`Subscribed to MESSAGE-CHANNEL in redis. Count: ${count}`);
  }
});

redisSubscriber.on("message", (channel, message) => {
  if (channel === "MESSAGE-CHANNEL") {
    console.log(`Received message from Redis channel: ${message}`);
    io.emit("msg-fromserver", JSON.parse(message));
  }
});

io.on("connection", (socket) => {
  console.log(`Socket is active and connected: ${socket.id}`);

  socket.on("user-msg", async (payload) => {
    console.log(`Received message: ${JSON.stringify(payload)}`);
    // Publish message to the Redis channel using the publisher instance
    await redisPublisher.publish("MESSAGE-CHANNEL", JSON.stringify(payload));
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is active on port ${port}...`);
});
