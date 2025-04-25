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

const useGlobal = create((set: any, get: any) => ({


  //---------------------
  //   Initialization
  //---------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get('credentials')
    const tokens = await secure.get('tokens');

    if (credentials && tokens) {
      try {
        const request: UserSignInRequest
        = {
          username: credentials.username,
          password: credentials.password
        }
        
        const data = await fetchSignIn(request);
        let parsedData = data
        const user = parsedData?.user
        const tokens = parsedData?.token.jwt

        secure.set('tokens', tokens)
        secure.set('user', user)

        set((state: any) => ({
          initialized: true,
          authenticated: true,
          user: user,
          tokens: tokens
        }))
        return;
      } catch (error) {
        console.log('useGlobal.init: ', error)
      }
    }
    set((state: any) => ({
      initialized: true,
      authenticated: false,
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
    secure.set('user', user)
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
}))

export default useGlobal