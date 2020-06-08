// const http = require('http');
const url = require('url');
const fs = require('fs');
// const path = require('path')
// const host = '127.0.0.1';
// const port = 3000;

var last;
function fsManage(file,flag,content,newName) {
  function read() {
      fs.readFile(file, function(err, data) {
          if (err)  {
              node.writeHead(404, {'Content-Type': 'text/html'});
              node.end('404 Not Found');
          } else {
              node.write(data); 
              return node.end();
          }
      });
  }

  switch(flag) {
    case '0': read();
    break;
    case '1':  if (last !== content) {
                  last = content;
                  fs.appendFile(file,content, function(err) {
                    if (err) console.log('Error appending file');
                    console.log('append success');
                      // if (err) node.write('Error while update.\n' + err);
                      // node.write('Document "' + file + '" updated.\n\n');                            
                      // read();
                  });
                } else {
                  // read();
                }
    break;
    case '2':  fs.writeFile(file, content, function(err) {
                  if (err) node.write('Error while create.\n' + err);
                  node.write('Document "' + file + '" created:.\n\n');
                  read();
                });
    break;
    case '3': fs.unlink(file,(err) => {
      if (err) node.write('Error while deleting.\n' + err);
      node.write('File: "',file,'" deleted');
    });
    break;
    case '4': fs.rename(file, newName, (err) => {
      if (err) node.write('Error while renaming.\n' + err);
      node.end('New file name: "' + newName + '"');
    });
    break;
    default: "";
    break
  }
}

// const server = http.createServer((req,res) => {
//     res.writeHead(200, 'Content-Type','text/html');
    
    // let q = url.parse(req.url, true).query;
    // let file = q.fi;
    // let option = q.op;
    // let content = q.cont+'\n';
    // let newName = q.rename;

    // fsManage(file,res,option,content,newName); 

// });

// server.listen(port,host,() => {
//     console.log(`Running on ${host}:${port}`);
// });

// export default {
//   fsManage
// }
