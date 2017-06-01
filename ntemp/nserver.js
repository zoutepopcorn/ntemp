let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
const EventEmitter = require('events');
const util = require('util');

function Nserver() {
    EventEmitter.call(this);
    const that = this;
    let settings = [];

    this.set = (opt, set)  => {
        settings[opt] = set;
    }

    this.start = () => {
        console.log("start");
        console.log(settings);
        server.listen(settings.port);
        app.use(express.static(settings.dir));
        setInterval(() => that.emit("a", "tester") , 3000 );
        io.on('connection', (socket) => {
            count = Object.keys(io.sockets.adapter.sids).length;
            console.log("socket > " + count);
            socket.on("msg", (data) => that.emit("msg", data));
        });
    }
    that.on("send", (mess) => io.emit("msg", {id:"hii"}) );
}

util.inherits(Nserver, EventEmitter)

module.exports = Nserver;
