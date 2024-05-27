# Tockit (a TOTK sys-cricket client)
Tockit is a web-based client that runs on your computer and communicates with your homebrewed switch via the local network. Your switch must be running the homebrew tool sys-cricket. It is designed only for the game Tears of the Kingdom and will establish streams of data for the following properties:
- Current and max health
- Current and bonus stamina
- The complete player transformation matrix

It works with TOTK v 1.0 ONLY

The information is interpreted and displayed in a user-friendly way showing the following information:
- Player health
- Current player coordinates (matching on-screen coordinates)
- Current player speed
- Current player heading

Coordinates, speed, and heading are all displayed with 3 digits of precision.  Coordinates and heading are updated at 30fps while speed is calculated every 0.5 seconds.

## Known Issues
This is in active development so be prepared for things to break!  Here are some known issues and things to watch out for.
- sys-cricket seems to have a memory leak and stops functioning after about 5 minutes (the OS thread becomes unresponsive and you have to hard-reset your switch)
- sys-cricket cannot dynamically reconnect with the bridge so if you restart the bridge, you will likely need to restart sys-cricket too
- It's easy for all the ports to get confusing! If you have them wrong or they don't agree between the sysmodule and the bridge, it won't work.
  - LISTEN_PORT: The local HTTP server listens on this port and you use it in the URL to access the client
  - CRICKET_SERVER_PORT: The main port that sys-cricket is listening on for UDP messages to configure the streams
  - NXLINK_PORT: A port that the bridge listens on to receive all logging from sys-cricket.
  - The UDP streaming port: A random open port on your computer for the streaming of data (chosen automatically)
- All logging messages received from sys-cricket will be echoed to your terminal (via the nxlink port). Look here for hints as to what might be going wrong.

## How to Use
You need a homebrew switch running the latest version of Atmosphere (beyond the scope of this doc).  Install node.js on your computer (the latest LTS version should work fine).

Before running Tockit, you need the following:
1) Download and install sys-cricket on your switch
2) Download and install node.js LTS version on your computer
3) Download the code from this repo (either clone or download the zip)
4) Install dependencies by opening a terminal and running `npm i`
6) Build the client once from a terminal with: `npm run client`
5) Create a .env file in the root of the code folder with the following contents:
```
LISTEN_PORT=[local port on computer]
NXLINK_PORT=[logging port of sys-cricket, default is 42424]
CRICKET_SERVER_PORT=[main connection port of sys-cricket, default is 3000]
CRICKET_SERVER_ADDRESS=[the IP address of your switch]
```

To run Tockit, start the repeater server with `npm run server` then open your favorite browser and visit `http://localhost:[LISTEN_PORT]`.

## Developers
Both the client and server scripts have dev variants (`client:dev` and `server:dev`).  If you run these, it will monitor files for changes and restart or re-package automatically. You will still need to refresh your browser to see the client changes.

## How it Works
There are three components working together to make Tockit function:
- A sys-module on the switch (sys-cricket) designed to stream portions of memory to another computer on your network.
- A bridge program that connects the sys-cricket protocol (raw UDP packets) to a protocol supported by a web browser (WebSockets).
- A web app that connects to the repeater via WebSockets and controls everything (what memory to access, how to display it, etc.)

### The sysmodule (sys-cricket)
sys-cricket is a sysmodule (a program that runs in the background on the OS thread on the switch) that listens for network messages telling it to stream out portions of memory to a waiting client.  The portion of memory you want to stream, how much and what kind of data is located there, and how often you want it updated are all customizable.  It uses UDP for low-latency streaming.  It functions a lot like noexs and other remote debuggers but focuses on streaming data back in real-time.  See the sys-cricket repo for more details.

### The UDP to WS Bridge
sys-cricket uses UDP for everything and modern browsers do not support UDP (it is too low-level).  To deal with this, we create a local node.js program that handles all the UDP communication and listens for web browser connections via socket.io (via the WebSocket protocol).  It keeps the connection with sys-cricket alive and echos streamed data to any connected WebSocket client. It also listens for commands from the WebSocket client and will relay them to sys-cricket to establish specific data streams.

It also creates a local HTTP server (using express.js) that serves the bundled web app.

### The Tockit Web App
The app you interact with in your browser is a React.js app written using Socket.io and Material UI.  It is served by the node.js bridge so that you can access it on your localhost.  It also connects to the node.js bridge via socket.io.  This is where all the data specific to Tears of the Kingdom lives.  It knows the memory locations we are interested in and asks the node.js bridge to stream that data.  It receives the data and converts it into a nicely displayed read-out to help you understand the player character's location and speed with much greater precision than the in-game coordinates.
