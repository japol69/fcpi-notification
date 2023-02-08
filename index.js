const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');

var allowedOrigins = ['http://localhost:8082', 'https://platform.felinecouncil.ph', 'https://dev.felinecouncil.ph', 'https://beta.felinecouncil.ph'];

const io = require('socket.io')(http, {
  cors: {
    origins: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: function(origin, callback) {    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);    

    if(allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }    
    return callback(null, true);
  }
}));

app.get('/', (req, res) => {
  res.send('<h1>Well Hello There!/h1>');
});

app.get('/notifications', (req, res) => {
    //console.log('message: $_GET connected');
    // io.emit('notificationBroadcast', `server: ${req.body}`);  
    res.json(req.body)
})


app.post('/notifications', (req, res) => {
    //console.log('message post: ' + msg);
    io.emit('notificationBroadcast', req.body );  
    res.json(req.body)
})

io.on('connection', (socket) => {
  //console.log('a user connected');

  socket.on('disconnect', () => {
    //console.log('user disconnected');
  });

  socket.on('notificationServer', (data) => {
    //console.log('message io-connection: ' + data);
    io.emit('notificationBroadcast', data);
  })  
});

http.listen( process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});