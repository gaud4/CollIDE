const express = require("express");
const bcrypt = require("bcrypt");
const collections = require("./mongo");
const CodeFile = require("./CodeFile");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const MinMaxPlugin = require("puppeteer-extra-plugin-minmax");
// const fs = require("fs");
const cors = require("cors");
const { exec, execSync } = require("child_process");
const http = require("http");
const { Server } = require("socket.io");
//app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 5000;

puppeteer.use(MinMaxPlugin());

const fs = require("fs").promises; // Use fs.promises for async file operations
// Middleware to parse incoming JSON requests
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const jwt = require("jsonwebtoken");
const JWT_SECRET = "amogussasmitbaka";

app.use(cors());
app.use(express.json());

let browser;
let page;
var output;

app.get("/", cors(), (req, res) => {});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/collide", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.post("/", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find user by username or email
//     const user = await collections.findOne({
//       $or: [{ email: username }, { username: username }],
//     });

//     // Check if user exists
//     if (!user) {
//       return res.json("notexist");
//     }

//     // Extract salt and hashed password from the user object
//     const storedSalt = user.salt;
//     const storedHashedPassword = user.password;

//     // Combine the retrieved salt with the entered password and hash the combined string
//     const saltedPassword = storedSalt + password;
//     const hashedPassword = await bcrypt.hash(saltedPassword, 10);

//     // console.log("Stored Hashed Password:", storedSalt);
//     // console.log("Hashed Password from Input:", hashedPassword);

//     const checker = await bcrypt.compare(saltedPassword, user.password);

//     // console.log("Checker:", checker);

//     // Compare the hashed result with the stored hashed password
//     if (checker) {
//       res.json("exist");
//     } else {
//       res.json("notmatch");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.json("fail");
//   }
// });

// app.post("/signup", async (req, res) => {
//   const { email, username, password } = req.body;

//   try {
//     // Check if the user already exists
//     const userExists = await collections.findOne({
//       $or: [{ email: username }, { username: username }],
//     });
//     if (userExists) {
//       return res.json("exist");
//     }

//     // Generate a random salt
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);

//     // Append the salt to the front of the password
//     const saltedPassword = salt + password;

//     // Hash the salted password
//     const HashedPassword = await bcrypt.hash(saltedPassword, saltRounds);

//     // Create user data object with email, username, salt, and hashed password
//     const userData = {
//       email: email,
//       username: username,
//       salt: salt,
//       password: HashedPassword,
//     };

//     // Store the user data in the database
//     await collections.insertOne(userData);

//     res.json("notexist");
//   } catch (e) {
//     console.error("Error:", e);
//     res.json("fail");
//   }
// });

app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await collections.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user) {
      return res.json("notexist");
    }

    // Extract salt and hashed password from the user object
    const saltedPassword = user.salt + password;

    const checker = await bcrypt.compare(saltedPassword, user.password);

    if (checker) {
      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" } // Token valid for 1 hour
      );

      return res.json({ message: "exist", token });
    } else {
      return res.json({ message: "notmatch", token: null });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: "fail", token: null });
  }
});

// Signup Route
// app.post("/signup", async (req, res) => {
//   const { email, username, password } = req.body;

//   try {
//     // Check if the user already exists
//     const userExists = await collections.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (userExists) {
//       return res.json("exist");
//     }

//     // Generate a random salt
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);

//     // Append the salt to the front of the password
//     const saltedPassword = salt + password;

//     // Hash the salted password
//     const hashedPassword = await bcrypt.hash(saltedPassword, saltRounds);

//     // Create user data object with email, username, salt, and hashed password
//     const userData = {
//       email,
//       username,
//       salt,
//       password: hashedPassword,
//     };

//     // Store the user data in the database
//     await collections.insertOne(userData);

//     res.json({ message: "Signup successful" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.json("fail");
//   }
// });

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await collections.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.json({ message: "exist", token: null });
    }

    // Generate a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Append the salt to the front of the password
    const saltedPassword = salt + password;

    // Hash the salted password
    const hashedPassword = await bcrypt.hash(saltedPassword, saltRounds);

    // Create user data object with email, username, salt, and hashed password
    const userData = {
      email,
      username,
      salt,
      password: hashedPassword,
    };

    // Store the user data in the database
    await collections.insertMany(userData);

    // Generate JWT token after successful signup
    const token = jwt.sign(
      { email, username }, // Payload
      "your-secret-key", // Secret key (store it securely)
      { expiresIn: "1h" } // Set token expiration time
    );

    // Send response with the token
    res.json({
      message: "success",
      token, // Send the token to frontend
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: "fail", token: null });
  }
});

// app.post("/create", async (req, res) => {
//   try {
//     console.log("/create was used");
//     const { room, content } = req.body;
//     const newCodeFile = new CodeFile({
//       room,
//       content,
//     });

//     const fileExists = await CodeFile.findOne({ room });
//     console.log(fileExists);

//     if (!fileExists) {
//       console.log("not exists");
//       const savedFile = await newCodeFile.save();
//       res.status(201).send(savedFile);
//     } else {
//       console.log("already exists");
//       res.status(200).json({ error: "already exists" });
//     }
//   } catch (error) {
//     console.log("Error creating file:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/create", async (req, res) => {
  try {
    console.log("/create was used");
    const { room, content } = req.body;

    // Validate input
    if (!room || typeof room !== "string" || room.trim() === "") {
      return res
        .status(400)
        .json({ error: "Room name is required and must be valid." });
    }

    // Check if the file already exists
    const fileExists = await CodeFile.findOne({ room });
    console.log(fileExists);

    if (!fileExists) {
      console.log("not exists");
      // Create and save new file only if it doesn't exist
      const newCodeFile = new CodeFile({ room, content });
      const savedFile = await newCodeFile.save();
      res.status(201).send(savedFile);
    } else {
      console.log("already exists");
      res.status(300).json({ error: "already exists" });
    }
  } catch (error) {
    console.log("Error creating file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a GET endpoint to retrieve files
app.get("/files", async (req, res) => {
  //console.log("123123asdasd");
  try {
    const files = await CodeFile.find();
    res.json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//   Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/files/:id", async (req, res) => {
  //console.log("123123asdasd");
  try {
    const fileId = req.params.id; // Extract file ID from the request params

    // Query the database to retrieve the file by ID
    const file = await CodeFile.findById(fileId);

    // If the file does not exist, return a 404 Not Found response
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send the file content as a response
    res.json({ content: file.content });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/files/:id", async (req, res) => {
  //console.log("123123asdasd");
  const fileId = req.params.id;
  try {
    // Logic to delete file from the database
    const result = await CodeFile.findByIdAndDelete(fileId);
    if (!result) {
      return res.status(404).send({ message: "File not found" });
    }
    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/rooms/:id", async (req, res) => {
  const roomId = req.params.id;
  const newContent = req.body.content; // Assuming content comes from the request body

  try {
    console.log("daalra hu koshish");
    // Update or insert (upsert) room content in the database
    const result = await CodeFile.updateOne(
      { room: roomId }, // Query to find the room
      { $set: { content: newContent } }, // Data to update or insert
      { upsert: true } // Upsert option enabled
    );

    if (result.upsertedCount > 0) {
      res.status(201).send({ message: "Room created successfully", result });
    } else if (result.matchedCount > 0) {
      res.status(200).send({ message: "Room updated successfully", result });
    } else {
      res.status(404).send({ message: "Room not found or updated", result });
    }
  } catch (error) {
    console.error("Error updating or inserting room:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(8000, () => {
  console.log("port connected");
});

// async function launchBrowserAndWaitForLogin() {
//     browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//         args: ['--start-maximized']
//     });
//     page = await browser.newPage();
//     await page.goto('https://codeforces.com/enter');
//     console.log("Please log in to Codeforces in the opened browser window.");
// }

// launchBrowserAndWaitForLogin().catch(console.error);

// app.get('/scrape', async (req, res) => {
//     const problemCode = req.query.problemCode;
//     if (!problemCode) {
//         return res.status(400).send('Problem code parameter is missing');
//     }
//     const formattedProblemCode = problemCode.replace(/(\d+)([A-Z]+)/, "$1/$2");

//     const problemLink = `https://codeforces.com/problemset/problem/${formattedProblemCode}`;

//     try {
//         const response = await axios.get(problemLink);
//         const $ = cheerio.load(response.data);
//         const testCases = [];
//         $('.test-example-line').each((i, el) => {
//             testCases.push($(el).text());
//         });
//         res.json(testCases);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error occurred while scraping');
//     }
// });

app.post("/fileExist", async (req, res) => {
  try {
    const { room } = req.body;

    // Check if the room exists in the database
    const file = await CodeFile.findOne({ room });

    if (file) {
      // If room exists, send its content
      res.status(200).json({ exists: true, content: file.content });
    } else {
      // If room does not exist, send a response indicating so
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking room existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/runCode", async (req, res) => {
  const { code, input } = req.body;

  // Validate the request to ensure both code and input are provided
  if (!code || !input) {
    return res
      .status(400)
      .json({ error: "Both code and input fields are required." });
  }

  try {
    // Run the code and get the output
    const output = await runn(code, input);

    // If no output was generated, return an empty response
    if (output === undefined) {
      return res.status(200).send("");
    }

    // Otherwise, return the output
    return res.status(200).send("Output : \n" + output);
  } catch (error) {
    // Catch any errors and return a 500 internal server error
    console.log("Internal server error: ", error);
    return res.status(500).send({ error: "Internal server error." });
  }
});
// app.post("/runCode", async (req, res) => {
//   bodyParser.json();
//   const { code, input } = req.body;
//   // console.log(req.body)
//   // console.log(code)
//   // console.log(input)
//   if (!code || !input) {
//     return res
//       .status(400)
//       .json({ error: "Both code and input fields are required." });
//   }

//   try {
//     await runn(code, input);
//     console.log("result " + output);
//     if (output == undefined) {
//       return res.status(200).send("");
//     } else return res.status(200).send("Output : \n" + output);
//   } catch (error) {
//     console.log("internal server error " + error);
//     return res.status(500).send({ error: "Internal server error." });
//   }
// });

// async function callRun(code , input ){
//     output = await runn(code , input)
//     return output
// }

async function runn(code, input) {
  const sourceFile = "temp_code.cpp";
  const outputFile = "temp_output";

  try {
    // Write C++ code to a temporary file
    await fs.writeFile(sourceFile, code);

    // Compile the C++ file
    await new Promise((resolve, reject) => {
      exec(`g++ ${sourceFile} -o ${outputFile}`, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(new Error(error?.message || stderr));
        } else {
          resolve();
        }
      });
    });

    // Execute the compiled program with input
    const result = execSync(`./${outputFile}`, { input }).toString();
    return result.trim(); // Return the result of execution, trimmed
  } catch (error) {
    // If there's an error during compilation or execution, return the error message
    return `Error: ${error.message}`;
  } finally {
    // Clean up temporary files
    try {
      await fs.unlink(sourceFile); // Delete the source code file
      await fs.unlink(outputFile); // Delete the compiled output file
    } catch (cleanupError) {
      console.error("Error cleaning up temporary files:", cleanupError);
    }
  }
}

// async function runn(code, input) {
//   fs.writeFileSync("code.cpp", code);
//   // var result

//   try {
//     // execSync('g++ code.cpp -o code', { stdio: 'ignore' });
//     exec("g++ code.cpp -o code", (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         output = error.message;
//         fs.writeFileSync("output.txt", output);
//         // console.log(output)
//         return "Execution error: " + output;
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         // return;
//         output = "Execution error: " + stderr;
//         fs.writeFileSync("output.txt", output);
//         return "Execution error: " + stderr;
//       }
//       output = stdout;
//       console.log(`stdout:\n${stdout}`);
//       fs.writeFileSync("output.txt", stdout);
//       try {
//         const result = execSync(`./code`, { input }).toString();
//         console.log(result);
//         output = result.trim();
//         return result.trim();
//       } catch (error) {
//         output = "Execution error: " + error.message;
//         return "Execution error: " + error.message;
//       }
//     });
//   } catch (error) {
//     output = "Compilation error: \n" + error.message;
//     return output;
//   }
// }

// app.post("/submit", async (req, res) => {
//   const { code, problemCode } = req.body;

//   try {
//     if (!browser || !page) {
//       return res.status(500).send("Puppeteer not initialized");
//     }

//     const filePath = "sol.cpp";
//     fs.writeFileSync(filePath, code);

//     await page.goto("https://codeforces.com/problemset/submit");

//     await page.select('select[name="programTypeId"]', "89");

//     await page.type('input[name="submittedProblemCode"]', problemCode);

//     const fileInput = await page.$('input[name="sourceFile"]');
//     await fileInput.uploadFile(filePath);

//     await page.click(".submit");
//     await page.waitForNavigation();

//     fs.unlinkSync(filePath);

//     res.send("Solution submitted");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error occurred while submitting solution");
//   }
// });

// const userSocketMap = {};

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on('join', ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit('joined', {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on('code_change', ({ roomId, code }) => {
//         socket.in(roomId).emit('code_change', { code });
//     });

//     socket.on('sync_code', ({ socketId, code }) => {
//         io.to(socketId).emit('code_change', { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit('disconnected', {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// =======
// const app = express();

// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');

// const ACTIONS = require('./src/Actions');

// const server = http.createServer(app);
// const io = new Server(server);

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
