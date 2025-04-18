import { Platform } from "react-native";
import axios from 'axios'
import { UserSignInRequest, UserSignUpRequest, UserVerifyAccountRequest } from "@/interfaces/User";
import { GroupInformationRequest } from "@/interfaces/Group";
import { SendRequest, SendResponse } from "@/interfaces/Request";

export const ADDRESS = "msg.igt.vn:7070"

// const api = axios.create({
//   baseURL: 'http://' + ADDRESS,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// export default api

const BASE_URL = 'http://' + ADDRESS + '/Backend/api/controller'
const REGISTER_URL = `/profile/register.php`
const LOGIN_URL = `/profile/login.php`
const LOGOUT_URL = `/profile/logout.php`
const VERIFY_URL = `profile/verifyAccount.php`
const CREATE_GROUP_URL = `/group/createGroup.php`
const GET_FRIENDS_URL =  `/friends/getFriends.php`
const GET_GROUPS_URL = `/group/getGroups.php`
const SEND_RESPONSE_URL = `/friends/sendResponse.php`
const SEND_REQUEST_URL = `/friends/sendRequest.php`
const GET_PENDING_LIST_URL = `/friends/getPending.php`

// User API

/*
  Sign up API
  Response: UserSignUpResponse
*/
export const fetchSignUp = async ({username, email, firstName, lastName, password} : UserSignUpRequest) => {
  const endpoint = BASE_URL + REGISTER_URL
  console.log("Start call API")
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      firstName: firstName,
      lastName: lastName,
      password,
    }),
  })
  console.log("End call API")
  console.log("endpoint", endpoint)
  console.log("body", JSON.stringify({
    username,
    email,
    firstName: firstName,
    lastName: lastName,
    password,
  }),)
  console.log("Response: ", response)
  if (!response.ok) {
    throw new Error('Failed to sign up');
  }
  const rawData = await response.text();
  const data = JSON.parse(rawData)
  return data.results || data;
}

/*
  Verify API
  Response: UserSignInResponse
*/
export const fetchVerifyAccount = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + VERIFY_URL
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to sign up');
  }
  const data = await response.json();
  return data.results;
}

/*
  Sign in API
  Response: UserSignInResponse
*/
export const fetchSignIn = async ({username, password} : UserSignInRequest) => {
  const endpoint = BASE_URL + LOGIN_URL
  console.log("Start call API")
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
  console.log("Response: ", response)
  if (!response.ok) {
    throw new Error('Failed to sign in');
  }
  const data = await response.json();
  return data.results;
}

/*
  Sign out API
  Response: null
*/
export const fetchSignOut = async () => {
  const endpoint = BASE_URL + LOGOUT_URL
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to sign out');
  }
  console.log("Response: ", response)
  const data = await response.json();
  return data.results;
}


// Get Data API
/*
  Get Friends API
  Response: List<UserInformation>
*/
export const fetchFriends = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_FRIENDS_URL
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch friend list');
  }
  const data = await response.json();
  return data.results;
}

/*
  Get Search Friends API
  Response: List<UserInformation>
*/

export const fetchSearch = async ({token, id} : UserVerifyAccountRequest, keyword: string) => {
  const endpoint = BASE_URL + `/profile/findUser.php?keyword=${keyword}`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }
  const data = await response.json();
  return data.results;
}

/*
  Creat Group API
  Response: CreateGroupResponse
*/
export const fetchCreateGroup = async ({token, id} : UserVerifyAccountRequest, {groupName, groupPic, member, freeTalk, freeInvite} : GroupInformationRequest) => {
  const endpoint = BASE_URL + CREATE_GROUP_URL
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      group_name: groupName,
      group_pic: groupPic,
      member,
      free_talk: freeTalk,
      free_invite: freeInvite,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to create group');
  }
  const data = await response.json();
  return data.results;
}

/*
  Get Groups API
  Response: List<GroupInformationWithMemberResponse>
*/
export const fetchGroups = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_GROUPS_URL
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch group list');
  }
  const data = await response.json();
  return data.results;
}

/*
  Get Pending List API
  Response: List<UserInformation>
*/
export const fetchPendingList = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_PENDING_LIST_URL
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch pending list');
  }
  const data = await response.json();
  return data.results;
}

/*
  Send Request API
  Response: null
*/
export const fetchSendRequest = async ({token, id} : UserVerifyAccountRequest, {friendId} : SendRequest) => {
  const endpoint = BASE_URL + SEND_REQUEST_URL
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      friendId,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to send request');
  }
  const data = await response.json();
  return data.results;
}

/*
  Send Response API
  Response: null
*/
export const fetchSendResponse = async ({token, id} : UserVerifyAccountRequest, {friendId, responseStatus} : SendResponse) => {
  const endpoint = BASE_URL + SEND_RESPONSE_URL
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      friendId,
      responseStatus,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to send response');
  }
  const data = await response.json();
  return data.results;
}