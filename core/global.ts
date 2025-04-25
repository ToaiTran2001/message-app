import { create } from 'zustand'
import secure from './secure'
import { ADDRESS, fetchSignIn } from '../services/api'
import utils from './utils'
import useFetch from '@/services/useFetch'
import { UserSignInRequest } from '@/interfaces/User'
import { io } from "socket.io-client";




//-------------------------------------
//   Socket receive message handlers
//-------------------------------------

// Set friendList state
const responseFriendList = (set: any, get: any, friendList: any) => {
  set((state: any) => ({
    friendList: friendList
  }))
}

// Add new friend to the start of the friendList
const responseFriendNew = (set: any, get: any, friend: any) => {
  const friendList = [friend, ...get().friendList]
  set((state: any) => ({
    friendList: friendList
  }))
}

// Set messageList state
const responseMessageList = (set: any, get: any, data: any) => {
  set((state: any) => ({
    messagesList: [...get().messagesList, ...data.messages],
    messagesNext: data.next,
    messagesUsername: data.friend.username
  }))
}

// Set messageList state and update the friendList item
const responseMessageSend = (set: any, get: any, data: any) => {
  const username = data.friend.username
  // Move friendList item for this friend to the start of 
  // list, update the preview text and update the time stamp
  const friendList = [...get().friendList]
  const friendIndex = friendList.findIndex(
    item => item.friend.username === username
  )
  if (friendIndex >= 0) {
    const item = friendList[friendIndex]
    item.preview = data.message.text
    item.updated = data.message.created
    friendList.splice(friendIndex, 1)
    friendList.unshift(item)
    set((state: any) => ({
      friendList: friendList
    }))
  }
  // If the message data does not belong to this friend then 
  // dont update the message list, as a fresh messageList will 
  // be loaded the next time the user opens the correct chat window
  if (username !== get().messagesUsername) {
    return
  }
  const messagesList = [data.message, ...get().messagesList]
  set((state: any) => ({
    messagesList: messagesList,
    messagesTyping: null
  }))
}

const  responseMessageType = (set: any, get: any, data: any) => {
  if (data.username !== get().messagesUsername) return
  set((state: any) => ({
    messagesTyping: new Date()
  }))
}

const responseRequestAccept = (set: any, get: any, connection: any) => {
  const user = get().user
  // If I was the one that accepted the request, remove 
  // request from the  requestList
  if (user.username === connection.receiver.username) {
    const requestList = [...get().requestList]
    const requestIndex = requestList.findIndex(
      request => request.id === connection.id
    )
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1)
      set((state: any) => ({
        requestList: requestList
      }))
    }
  } 
  // If the corresponding user is contained within the  
  // searchList for the  acceptor or the  acceptee, update 
  // the state of the searchlist item
  const sl = get().searchList
  if (sl === null) {
    return
  }
  const searchList = [...sl]

  let  searchIndex = -1
  // If this user accepted
  if (user.username === connection.receiver.username) {
    searchIndex = searchList.findIndex(
      user => user.username === connection.sender.username
    )
  // If the other user accepted
  } else {
    searchIndex = searchList.findIndex(
      user => user.username === connection.receiver.username
    )
  }
  if (searchIndex >= 0) {
    searchList[searchIndex].status = 'connected'
    set((state: any) => ({
      searchList: searchList
    }))
  }
}

// const responseRequestConnect = (set: any, get: any, connection: any) => {
//   const user = get().user
//   // If i was the one that made the connect request, 
//   // update the search list row
//   if (user.username === connection.sender.username) {
//     const searchList = [...get().searchList]
//     const searchIndex = searchList.findIndex(
//       request => request.username === connection.receiver.username
//     )
//     if (searchIndex >= 0) {
//       searchList[searchIndex].status = 'pending-them'
//       set((state: any) => ({
//         searchList: searchList
//       }))
//     }
//   // If they were the one  that sent the connect 
//   // request, add request to request list
//   } else {
//     const requestList = [...get().requestList]
//     const requestIndex = requestList.findIndex(
//       request => request.sender.username === connection.sender.username
//     )
//     if (requestIndex === -1) {
//       requestList.unshift(connection)
//       set((state: any) => ({
//         requestList: requestList
//       }))
//     }
//   }
// }

// const responseRequestList = (set: any, get: any, requestList: any) => {
//   set((state: any) => ({
//     requestList: requestList
//   }))
// }

// const responseSearch = (set: any, get: any, data: any) => {
//   set((state: any) => ({
//     searchList: data
//   }))
// }


// const responseThumbnail = (set: any, get: any, data: any) => {
//   set((state: any) => ({
//     user: data
//   }))
// }

const useGlobal = create((set: any, get: any) => ({


  //---------------------
  //   Initialization
  //---------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get('credentials')
    if (credentials) {
      try {
        const request: UserSignInRequest
        = {
          username: credentials.username,
          password: credentials.password
        }
        const response = useFetch(
          () => fetchSignIn(request), false)
        if (response.error) {
          throw 'Authentication error'
        }

        let parsedData = response.data
        if (typeof response.data === "string") {
          parsedData = utils.parseParams(parsedData)
        }
        const user = parsedData?.user
        const tokens = parsedData?.token.jwt

        secure.set('tokens', tokens)

        set((state: any) => ({
          initialized: true,
          authenticated: true,
          user: user
        }))
        return
      } catch (error) {
        console.log('useGlobal.init: ', error)
      }
    }
    set((state: any) => ({
      initialized: true,
    }))
  },
  
  //---------------------
  //   Authentication
  //---------------------

  authenticated: false,
  tokens: "",
  user: {},

  login: (credentials: any, user: any, tokens: any) => {
    secure.set('credentials', credentials)
    secure.set('tokens', tokens)
    set((state: any) => ({
      authenticated: true,
      user: user,
      tokens: tokens
    }))
  },

  logout: () => {
    secure.wipe()
    set((state: any) => ({
      authenticated: false,
      user: {},
      tokens: ""
    }))
  },

  //---------------------
  //     Websocket
  //---------------------

  // socket: null,

  // socketConnect: async () => {
  //   const tokens = await secure.get('tokens')

  //   const url = `ws://${ADDRESS}/chat/?token=${tokens.access}`

  //   const socket = new WebSocket(url)
  //   socket.onopen = () => {
  //     console.log('socket.onopen')

  //     socket.send(JSON.stringify({
  //       source: 'request.list'
  //     }))
  //     socket.send(JSON.stringify({
  //       source: 'friend.list'
  //     }))
  //   }
  //   socket.onmessage = (event) => {
  //     // Convert data to javascript object
  //     const parsed = JSON.parse(event.data)

  //     // Debug log formatted  data
  //     console.log('onmessage:', parsed)

  //     const responses = {
  //       'friend.list':     responseFriendList,
  //       'friend.new':      responseFriendNew,
  //       'message.list':    responseMessageList,
  //       'message.send':    responseMessageSend,
  //       'message.type':    responseMessageType,
  //       'request.accept':  responseRequestAccept,
  //       'request.connect': responseRequestConnect,
  //       'request.list':    responseRequestList,
  //       'search':          responseSearch,
  //       'thumbnail':       responseThumbnail
  //     }
  //     const resp = responses[parsed.source as keyof typeof responses]
  //     if (!resp) {
  //       // utils.log('parsed.source "' + parsed.source + '" not found')
  //       console.log('parsed.source "' + parsed.source + '" not found')
  //       return
  //     }
  //     // Call response function
  //     resp(set, get, parsed.data)
  //   }
  //   socket.onerror = (e) => {
  //     // utils.log('socket.onerror', e.message)
  //     console.log('socket.onerror', (e as ErrorEvent).message)
  //   }
  //   socket.onclose = () => {
  //     // utils.log('socket.onclose')
  //     console.log('socket.onclose')
  //   }
  //   set((state: any) => ({
  //     socket: socket
  //   }))
  // },
  // socketConnect: async (set: any, get: any) => {
  //   const tokens = await secure.get("tokens");
  
  //   // Define the connection URL with the token
  //   const url = `http://115.78.92.177:8000/`;
  
  //   // Create a socket connection with the token as a query parameter
  //   const socket = io(url, {
  //     query: {
  //       token: tokens.access,
  //     },
  //     transports: ["websocket"], // Ensure WebSocket is the transport protocol
  //   });
  
  //   // Socket event listeners
  //   socket.on("connect", () => {
  //     console.log("socket.io connected");
  
  //     // Emit events
  //     socket.emit("request.list");
  //     socket.emit("friend.list");
  //   });
  
  //   socket.on("message", (parsed) => {
  //     // Debug log formatted data
  //     console.log("onmessage:", parsed);
  
  //     const responses = {
  //       "friend.list": responseFriendList,
  //       "friend.new": responseFriendNew,
  //       "message.list": responseMessageList,
  //       "message.send": responseMessageSend,
  //       "message.type": responseMessageType,
  //       "request.accept": responseRequestAccept,
  //       "request.connect": responseRequestConnect,
  //       "request.list": responseRequestList,
  //       "search": responseSearch,
  //       "thumbnail": responseThumbnail,
  //     };
  
  //     const resp = responses[parsed.source];
  //     if (!resp) {
  //       console.log(`parsed.source "${parsed.source}" not found`);
  //       return;
  //     }
  
  //     // Call the response function
  //     resp(set, get, parsed.data);
  //   });
  
  //   socket.on("connect_error", (error) => {
  //     console.error("Socket connection error:", error.message);
  //   });
  
  //   socket.on("disconnect", () => {
  //     console.log("socket.io disconnected");
  //   });
  
  //   // Save socket instance in state
  //   set((state) => ({
  //     socket,
  //   }));
  // },
  

  // socketClose: () => {
  //   const socket =  get().socket
  //   if (socket) {
  //     socket.close()
  //   }
  //   set((state: any) => ({
  //     socket: null
  //   }))
  // },

  //---------------------
  //     Search
  //---------------------

  // searchList: null,

  // searchUsers: (query: any) => {
  //   if (query) {
  //     const socket = get().socket
  //     socket.send(JSON.stringify({
  //       source: 'search',
  //       query: query
  //     }))
  //   } else {
  //     set((state: any) => ({
  //       searchList: null
  //     }))
  //   }
  // },

  //---------------------
  //     Requests
  //---------------------

  friendList: null,


  //---------------------
  //     Messages
  //---------------------

  messagesList: [],
  messagesNext: null,
  messagesTyping: null,
  messagesUsername: null,

  messageList: (connectionId: any, page=0) => {
    if (page === 0) {
      set((state: any) => ({
        messagesList: [],
        messagesNext: null,
        messagesTyping: null,
        messagesUsername: null
      }))
    } else {
      set((state: any) => ({
        messagesNext: null
      }))
    }
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'message.list',
      connectionId: connectionId,
      page: page
    }))
  },

  messageSend: (connectionId: any, message: string) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'message.send',
      connectionId: connectionId,
      message: message
    }))
  },

  messageType: (username: string) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'message.type',
      username: username
    }))
  },

  //---------------------
  //     Requests
  //---------------------

  requestList: null,

  requestAccept: (username: string) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'request.accept',
      username: username
    }))
  },

  requestConnect: (username: string) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'request.connect',
      username: username
    }))
  },

  //---------------------
  //     Thumbnail
  //---------------------

  uploadThumbnail: (file: any) => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source: 'thumbnail',
      base64: file.base64,
      filename: file.fileName
    }))
  }

}))




export default useGlobal