const Ntemp = require('./ntemp');
let ntemp = new Ntemp();
let q = []; // fill question
const dir = __dirname + "/html";

let em = ntemp.start({dir: dir});
em.on("msg", (data) => {
    console.log(data);
});

// send socket message with msg
setInterval(()=> em.emit("send", {from: "user"}), 10000);
