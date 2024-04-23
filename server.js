const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const MinMaxPlugin = require('puppeteer-extra-plugin-minmax');
const fs = require('fs');
const cors = require('cors');
const { exec } = require('child_process');
const http = require('http');
const { execSync } = require('child_process');
const { Server } = require('socket.io');

puppeteer.use(MinMaxPlugin());

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

let browser;
let page;
var output;
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

app.post('/runCode', async (req, res) => {
    bodyParser.json()
    const { code, input } = req.body;
    // console.log(req.body)
    // console.log(code)
    // console.log(input)
    if (!code || !input) {
        return res.status(400).json({ error: 'Both code and input fields are required.' });
    }

    try {
        await runn(code, input);
        console.log("result " + output)
        return res.status(200).send("Output : \n" + output );
    } catch (error) {
        console.log("internal server error " + error)
        return res.status(500).send({ error: 'Internal server error.' });
    }
});

// async function callRun(code , input ){
//     output = await runn(code , input)
//     return output
// }
async function runn(code, input) {
    fs.writeFileSync('code.cpp', code);
    // var result
   
    try {
        // execSync('g++ code.cpp -o code', { stdio: 'ignore' });
        exec('g++ code.cpp -o code', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                output = error.message
                fs.writeFileSync('output.txt', output);
                // console.log(output)
                return ('Execution error: ' + output);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                // return;
                output = 'Execution error: ' + stderr;
                fs.writeFileSync('output.txt', output);
                return 'Execution error: ' + stderr;
            }
            output = stdout
            console.log(`stdout:\n${stdout}`);
            fs.writeFileSync('output.txt', stdout);
            try {
                const result = execSync(`./code`, { input }).toString();
                console.log(result)
                output = result.trim();
                return result.trim();
            } catch (error) {
                output ='Execution error: ' + error.message; 
                return 'Execution error: ' + error.message;
            }
        });
    } catch (error) {
        output = 'Compilation error: \n' + error.message;
        return output
    }
}


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




const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
