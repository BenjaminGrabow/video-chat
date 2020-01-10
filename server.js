// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const port = process.env.PORT || 3000;

// app.use(express.static(__dirname + '/public'));
// let clients = 0;

// io.on('connection', function(socket){
//   socket.on('NewClient', function(){
//     if(clients < 2){
//       if(clients === 1){
//         this.emit('CreatePeer')
//       }
//     }
//     else {
//       this.emit('SessionActive')
//       clients++;
//     }
//   })
//   socket.on('Offer', SendOffer);
//   socket.on('Answer', SendAnswer);
//   socket.on('disconnect', Disconnect);
// })

// function Disconnect() {
//   if (clients > 0)
//   clients--;
// }

// function SendOffer(offer){
//   this.broadcast.emit('BackOffer', offer);
// }


// function SendAnswer(data){
  //   this.broadcast.emit('BackAnswer', data);
  // }
  
  // http.listen(port, () => console.log(`Active on ${port} port`));
  const express = require('express');
  const Pusher = require('pusher');
  
const server = express();


server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Dev Coach API' });
});


// catch-all endpoint
server.all('*', (req, res) => {
  res.status(404).send({
    error: 'The resource you are looking for does not exist',
  });
});

server.post('/video', (req, res) => {
  // res.status(200).json({ message: 'Welcome to the Dev Coach API' });
  socketId = req.socker_id;
  channelName = req.channel_name;
  const pusher = new Pusher({
    appId: '929598',
    key: '9ebd578e6fc08eeb098e',
    secret: '123a01ef8b0d8442bd0b',
    cluster: 'eu',
    encrypted: true
  });
  
  const presence_data = req.email;
  const key = pusher.presence_auth(channelName, socketId, req.userId, presence_data);

  return res.send({key});
  
  // pusher.trigger('my-channel', 'my-event', {
  //   "message": "hello world"
  // });

});



const port = process.env.PORT || 5000;
// server.listen(port, console.log(`Listening on Port ${port}`));

/* 
  With respect to listen EADDRINUSE :::5000 error returned when testing
  The problem is this: once the execution of the first test ends, the server is still listening on the port 5000. So when we require('../index') again in the second test file, it errors out because is port is still in use by the previous test file’s process.
  One simple fix for this issue is wrapping our app.listen() in a condition to check if the environment is a test environment or not. In a test environment, when running the server through Supertest, we do not really need to have the app listen on a network port.
  For more read https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
*/
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, console.log(`Listening on Port ${port}`));
}
