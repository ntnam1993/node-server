const io = require('socket.io')(3000)

const userInfos = [];
io.on('connection', socket => {
    socket.on("SIGNUP", user => {
        const isExist = userInfos.some(e => e.username == user.username)
        if (isExist) {
            return socket.emit('SINGUP_FAIL');
        }
        socket.peerId = user.peerId
        userInfos.push(user)
        socket.emit('ONLINE', userInfos)

        socket.broadcast.emit("NEW_ONLINE", user)
    })

    socket.on('disconnect', () => {
        const index = userInfos.findIndex(user => user.peerId === socket.peerId)
        userInfos.splice(index, 1)
        io.emit('OFFLINE', socket.peerId)
    })
})
