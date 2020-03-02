const fs = require('fs');

var last;
function fsManage(file,node,flag,content,newName) {

    function read(reqData) {
        fs.readFile(file, function(err, data) {
            if (err)  {
                node.writeHead(404, {'Content-Type': 'text/html'});
                node.end('404 Not Found');
            } else {
                node.write(data); 
                reqData && reqData(data);
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
                            if (err) node.write('Error while update.\n' + err);
                            node.write('Document "' + file + '" updated.\n\n');                            
                            read();
                        });
                    } else {
                        read();
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

let q = url.parse(req.url, true).query;
let file = q.fi;
let option = q.op;
let content = q.cont+'\n';
let newName = q.rename;

fsManage(file,res,option,content,newName); 

// Search for main.js file automaticly
// Map line to modify

export default {
    fsManage
}