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
let messages = [];

app.get('/', (req, res) =>  {
    res.render('index')
})

io.on('connection', (socket) => { //connect socket
    console.log('Socket ID: ' + socket.id + ' is connected');

    //connect
    connection.push(socket);
    console.log('Connected: %s socket(s) connected', connection.length);


    //disconnected
    socket.on('disconnect', (data) => { //disconnect socket
        users.splice(users.indexOf(socket.username), 1)
        connection.splice(connection.indexOf(socket), 1); //splice is to remove/add items. syntax: array.splice(index, howmany, item1, ....., itemX) wheree index is the start of remove/add, howmany is number of items to be removed (if set to 0 then no items will be removed), items = items pushed into the array
        console.log('Disconnected: %s socket(s) connected', connection.length)
    })


    // new user ME
    socket.on('new user', (data) => { //adds new users to our chatroom 
        // console.log(data.username)
        users.push(data.username)
        io.emit('get users', {new_user: users})
        // socket.username = data; //use data to push onto users array
        // users.push(socket.username)
        // io.emit('get users', data)
        // updateUsername(); //after we need to update the usernames
    })
    // // // new user
    // socket.on('new user', (data, callback) => { //adds new users to our chatroom 
    //     callback(true); // incidentally(not needed in this case) send back data value true
    //     socket.username = data; //use data to push onto users array
    //     users.push(socket.username)
    //     updateUsernames(); //after we need to update the usernames
    //     io.emit('get users', data)
    // })
    // function updateUsernames(){ 
    //     io.sockets.emit('get users', users)
    // }
    
    
    //send messages
    socket.on('send message', (data) => {
        // console.log(data.message) //testing if messages are coming from the client to the server
        // message = data.message
        messages.push(data.message)
        io.emit('new message', {msg: messages})
    })


    // socket.on('new user', (data, callback) => {
    //     callback(true);
    //     users.push(data)
    //     io.emit('get users', data)
    // })
})