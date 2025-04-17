import { Platform } from "react-native";
import axios from 'axios'

export const ADDRESS = Platform.OS === 'ios'
  ? 'localhost:8000'
  : '10.0.2.2:8000'

// const api = axios.create({
//   baseURL: 'http://' + ADDRESS,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// export default api

export const fetchSignUp = async ({username, email, firstName, lastName, password} : any) => {
  const endpoint = '/api/chat/signup/'
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to sign up');
  }
  const data = await response.json();
  return data.results;
}

export const fetchSignIn = async ({username, password} : any) => {
  const endpoint = '/api/chat/login/'
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to sign in');
  }
  const data = await response.json();
  return data.results;
}

export const fetchFriends = async (id: string) => {
  const endpoint = `/api/chat/friends/${id}`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch friend list');
  }
  const data = await response.json();
  return data.results;
}

export const fetchSearch = async (id: string, query: string) => {
  const endpoint = `/api/chat/search/${id}?q=${query}`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }
  const data = await response.json();
  return data.results;
}