const term = require( 'terminal-kit' ).terminal ;
const Nserver = require( './nserver.js' ) ;
let nserver = new Nserver();
const getPorts = require('get-ports')
const PORTS = [3000, 8000, 8080, 8888, 80];
const nl = () => term("\n") ;
let q = [];
let d = []; // default
let Walker = require('walker');

// constructor
function Ntemp() {
    term.on( 'key' , function( key , matches , data ) {
      if(key == "q")  // Key to kill the process
          process.exit(1);
    } ) ;
    let index = 0;
    const nextQ = () => {
      if(index < q.length) {
        term.bgRed(q[index].q);  // QUESTION
        term.singleLineMenu( q[index].a , { style: term.inverse ,
        selectedStyle: term.black.bgGreen } , ( error , res ) => {
            procQ(res, ()=> { index++; nextQ();  });
        } ) ; // AWNSER
      } else {
        nl();
        // >>>>>> END POINT
      }
    }
    const procQ = (res, cb) => {
        console.log(res);
        console.log(q[index].q);
        nl();
        //term.red(res.selectedText);

        if(q[index].q == "folder") {
          nl();
          // TODO: todo choose html
          console.log();
          const last = res.selectedText.substring(res.selectedText.indexOf("/") , res.selectedText.length);
          const mapje = __dirname + last;

          console.log("dir: " + mapje);
          nserver.set("dir", mapje);
          nserver.start();
        }
        if(q[index].q == "port") {
          nl();
          // TODO: todo choose html
          nserver.set("port", res.selectedText);
          //nserver.start();
        }
        cb();
    }

    let waitFor = new Promise ((res, rej) => {
          getPorts(PORTS, (err, ports) => {
              if (err) rej()
              q.push({q: "port", a: ports});
              let maps = [];
              Walker('./html/').on('dir', (dir, stat) => {

                  maps.push(dir);
              }).on('end', function() {
                  d.push({q: "folder", a: maps});
                  res();
              });
          });
    });

    this.start = (qu) => {
        term.clear();
        if(qu.length > 0) {
          term.bgBlack.yellow("CUSTOM Q\n");
          q = qu;
        } else {
          term.bgCyan.black("DEFAULT Q\n");
          q = d;
        }
        term.cyan(index);
        waitFor.then(() => term.red(nextQ()));
        return nserver;
    };

}

module.exports = Ntemp;
