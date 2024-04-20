const express = require('express');

const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const MinMaxPlugin = require('puppeteer-extra-plugin-minmax');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

puppeteer.use(MinMaxPlugin());

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

let browser;
let page;

async function launchBrowserAndWaitForLogin() {
    browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: null,
        args: ['--start-maximized']
    });
    page = await browser.newPage();
    await page.goto('https://codeforces.com/enter');
    console.log("Please log in to Codeforces in the opened browser window.");
}

launchBrowserAndWaitForLogin().catch(console.error);

app.get('/scrape', async (req, res) => {
    const problemCode = req.query.problemCode;
    if (!problemCode) {
        return res.status(400).send('Problem code parameter is missing');
    }
    const formattedProblemCode = problemCode.replace(/(\d+)([A-Z]+)/, "$1/$2");

    const problemLink = `https://codeforces.com/problemset/problem/${formattedProblemCode}`;
  
    try {
        const response = await axios.get(problemLink);
        const $ = cheerio.load(response.data);
        const testCases = [];
        $('.test-example-line').each((i, el) => {
            testCases.push($(el).text());
        });
        res.json(testCases);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while scraping');
    }
});

app.post('/submit', async (req, res) => {
    const { code, problemCode } = req.body;

    try {
        if (!browser || !page) {
            return res.status(500).send('Puppeteer not initialized');
        }

        const filePath = 'sol.cpp';
        fs.writeFileSync(filePath, code);

        await page.goto('https://codeforces.com/problemset/submit');

        await page.select('select[name="programTypeId"]', '89'); 

        await page.type('input[name="submittedProblemCode"]', problemCode);

        const fileInput = await page.$('input[name="sourceFile"]');
        await fileInput.uploadFile(filePath);

        await page.click('.submit');
        await page.waitForNavigation();

        fs.unlinkSync(filePath);

        res.send('Solution submitted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while submitting solution');
    }
});

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

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
=======
const app = express();

const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const ACTIONS = require('./src/Actions');

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



io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

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
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});




const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
