const express = require("express");
const app = express();
const CodeFile = require("./CodeFile");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const axios = require("axios");

const ACTIONS = require("./src/Actions");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

const upsertRoom = async (roomId, newContent) => {
  try {
    if (newContent !== null) {
      // Send a PUT request to the server to upsert the room content
      const response = await axios.post(
        `http://localhost:5000/rooms/${roomId}`,
        {
          content: newContent, // Pass new content in the request body
        }
      );
    }

    //alert(response.data.message); // Display success message

    // Optional: Update the UI or state (e.g., refresh the room list)
    // const update = await axios.get("http://localhost:5000/rooms");
    // setRooms(update.data); // Assuming `setRooms` updates your list of rooms
  } catch (error) {
    console.error("Error upserting room:", error);
    //alert("Error upserting room. Please try again.");
  }
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  let finalCode = "";

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
    // const roomConnections = io.sockets.adapter.rooms.get(roomId);
    // const numConnections = roomConnections ? roomConnections.size : 0;

    // console.log(`Room ${roomId} now has ${numConnections} connection(s).`);

    // Emit the count to all clients in the room
    //io.to(room).emit("updateConnections", numConnections);
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    console.log("code change event received");
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    // io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    finalCode = code;
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    console.log("code sync event received " + code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    finalCode = code;
  });

  // socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
  //     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  // });

  // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
  //     io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  // });

  //   socket.on("clientDisconnect", (roomId, code) => {
  //     //const rooms = [...socket.rooms];
  //     //rooms.forEach((roomId) => {
  //     //   socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
  //     //     socketId: socket.id,
  //     //     username: userSocketMap[socket.id],
  //     //   });
  //     console.log("disconnecccc2222");
  //     const roomConnections = io.sockets.adapter.rooms.get(roomId);
  //     const numConnections = roomConnections ? roomConnections.size : 0;
  //     console.log(numConnections);

  //     if (numConnections === 1 || numConnections === 0) {
  //       upsertRoom(roomId, code);
  //     }
  //     //});
  //     //delete userSocketMap[socket.id];
  //     //socket.leave();
  //   });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter((roomId) => roomId !== socket.id);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      console.log(rooms);
      const roomConnections = io.sockets.adapter.rooms.get(roomId);
      const numConnections = roomConnections ? roomConnections.size : 0;

      console.log("finalcode " + finalCode);

      //if (numConnections === 1 || numConnections === 0) {
      upsertRoom(roomId, finalCode);
      //}
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
