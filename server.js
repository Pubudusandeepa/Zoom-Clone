import express from 'express'
import http from 'http'
import viewsRouter from './router/views.js'
import socketIO from 'socket.io'
const app = express()
const server = http.createServer(app);
import pkg from 'peer';
const {ExpressPeerServer} = pkg;

const peerServer = ExpressPeerServer(server, {
    debug: true
});


// this line \/
const io = socketIO(server);


app.use('/peerjs', peerServer)
app.use(express.static('public'))
app.set('view engine', 'ejs')





//middleware
app.use('/', viewsRouter)
const port = process.env.PORT || 5000


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) =>{
       socket.join(roomId)
       socket.to(roomId).broadcast.emit('user-connected', userId)
       socket.on('message', message => {
           io.to(roomId).emit('createMessage', message)
       })
    })
})


server.listen(port, ()=>{
    console.log(`Server started ${port}`)
})