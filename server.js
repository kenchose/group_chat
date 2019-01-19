const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
const server = app.listen(8000, () => console.log('Listening on port 8000'));
const io = require('socket.io')(server);
let users = [];
let connection = [];

app.get('/', (req, res) =>  {
    res.render('index')
})

io.on('connection', (socket) => {
    // console.log('Socket ID: ' + socket.id + ' is connected');

    //connect
    connection.push(socket);
    console.log('Connected: %s socket(s) connected', connection.length);

    //disconnected
    socket.on('disconnect', (data) => {
        connection.splice(connection.indexOf(socket), 1); //splice is to remove/add items. syntax: array.splice(index, howmany, item1, ....., itemX) wheree index is the start of remove/add, howmany is number of items to be removed (if set to 0 then no items will be removed), items = items pushed into the array
        console.log('Disconnected: %s sockets connected', connection.length)
    })

    //send messages
    socket.on('send message', (data) => {
        io.emit('new message', {msg: data})
    })
    // socket.emit('hello', {msg: 'hello from the server'})
    // socket.on('thank you', (data) => {
    //     console.log(data.msg);
    // })
})
