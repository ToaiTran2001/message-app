import { Platform } from "react-native";
import axios from 'axios'
import { UserSignInRequest, UserSignUpRequest, UserVerifyAccountRequest } from "@/interfaces/User";
import { GroupInformationRequest } from "@/interfaces/Group";
import { SendRequest, SendResponse } from "@/interfaces/Request";

export const ADDRESS = "msg.igt.vn:7070"

export const SOCKET_ADDRESS = "115.78.92.177:8000"

const api = axios.create({
  baseURL: 'http://' + ADDRESS,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})
// export default api

const socketApi = axios.create({
  baseURL: 'http://' + SOCKET_ADDRESS,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})

const BASE_URL = 'http://' + ADDRESS + '/Backend/api/controller'
const SOCKET_BASE_URL = 'http://' + SOCKET_ADDRESS
const REGISTER_URL = `/profile/register.php`
const LOGIN_URL = `/profile/login.php`
const LOGOUT_URL = `/profile/logout.php`
const VERIFY_URL = `/profile/verifyAccount.php`
const CREATE_GROUP_URL = `/group/createGroup.php`
const MODIFY_GROUP_URL = ``
const GET_FRIENDS_URL =  `/friends/getFriends.php`
const GET_GROUPS_URL = `/group/getGroups.php`
const SEND_RESPONSE_URL = `/friends/sendResponse.php`
const SEND_REQUEST_URL = `/friends/sendRequest.php`
const GET_PENDING_LIST_URL = `/friends/getPending.php`
const POST_PICTURE_URL = ``
const GET_GROUP_INFO_URL = `/group/getGroupInfo.php`
const RECENT_MESSAGE_PERSONAL= `/api/messages/recent/personal`
const LEAVE_GROUP_URL = `/group/leaveGroup.php`
const GET_GROUP_LIST_USER_URL = `group/getUserGroupList.php`
const GET_PROFILE_URL = `/profile/getProfile.php`

// User API

/*
  Sign up API
  Response: UserSignUpResponse
*/
export const fetchSignUp = async ({username, email, firstName, lastName, password} : UserSignUpRequest) => {
  const endpoint = BASE_URL + REGISTER_URL
  console.log("Call API Sign Up")
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password
    }
  })
  
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     username,
  //     email,
  //     firstName: firstName,
  //     lastName: lastName,
  //     password,
  //   }),
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to sign up');
  // }
  // const rawData = await response.text();
}

/*
  Verify API
  Response: UserSignInResponse
*/
export const fetchVerifyAccount = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + VERIFY_URL
  console.log("Call API Verify")
  console.log("Endpoint", endpoint)
  console.log("Data: ", {
    token: token,
    id: id,
  })
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      token: token,
      id: id,
    },
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     id
  //   }),
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to sign up');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Sign in API
  Response: UserSignInResponse
*/
export const fetchSignIn = async ({username, password} : UserSignInRequest) => {
  const endpoint = BASE_URL + LOGIN_URL
  console.log("Call API Sign In")
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      username: username,
      password: password
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     username,
  //     password,
  //   }),
  // })
  // console.log("Response: ", response)
  // if (!response.ok) {
  //   throw new Error('Failed to sign in');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Sign out API
  Response: null
*/
export const fetchSignOut = async () => {
  const endpoint = BASE_URL + LOGOUT_URL
  console.log("Call API Sign Out")
  const response = await api({
    method: 'POST',
    url: endpoint,
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to sign out');
  // }
  // const data = await response.json();
  // return data.results;
}


// Get Data API
/*
  Get Friends API
  Response: List<UserInformation>
*/
export const fetchFriends = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_FRIENDS_URL
  console.log("Call API Get Friends")
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to fetch friend list');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Get Search Friends API
  Response: List<UserInformation>
*/

export const fetchSearch = async ({token, id} : UserVerifyAccountRequest, keyword: string) => {
  const endpoint = BASE_URL + `/profile/findUser.php?keyword=${keyword}`
  console.log("Call API Get Search Friends")
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to fetch search results');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Creat Group API
  Response: CreateGroupResponse
*/
export const fetchCreateGroup = async ({token, id} : UserVerifyAccountRequest, {groupName, groupPic, member, freeTalk, freeInvite} : GroupInformationRequest) => {
  const endpoint = BASE_URL + CREATE_GROUP_URL
  console.log("Call API Create Group")
  console.log("Body: ", {
    group_name: groupName,
    group_pic: groupPic,
    member,
    free_talk: freeTalk,
    free_invite: freeInvite,
  })
  console.log("Token :", token)

  console.log("Endpoint: ", endpoint)
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      groupName: groupName,
      groupPic: groupPic,
      member,
      freeTalk: freeTalk,
      freeInvite: freeInvite,
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     group_name: groupName,
  //     group_pic: groupPic,
  //     member,
  //     free_talk: freeTalk,
  //     free_invite: freeInvite,
  //   }),
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to create group');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Creat Group API
  Response: CreateGroupResponse
*/
export const fetchModifyGroup = async ({token, id} : UserVerifyAccountRequest, {groupName, groupPic, member, freeTalk, freeInvite} : GroupInformationRequest) => {
  const endpoint = BASE_URL + MODIFY_GROUP_URL
  console.log("Call API Modify Group")
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      group_name: groupName,
      group_pic: groupPic,
      member,
      free_talk: freeTalk,
      free_invite: freeInvite,
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Get Groups API
  Response: List<GroupInformationWithMemberResponse>
*/
export const fetchGroups = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_GROUPS_URL
  console.log("Call API Get Groups")
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to fetch group list');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Get Pending List API
  Response: List<UserInformation>
*/
export const fetchPendingList = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_PENDING_LIST_URL
  console.log("Call API Get Pending List")
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Endpoint: ", endpoint)
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to fetch pending list');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Send Request API
  Response: null
*/
export const fetchSendRequest = async ({token, id} : UserVerifyAccountRequest, {friendId} : SendRequest) => {
  const endpoint = BASE_URL + SEND_REQUEST_URL
  console.log("Friend ID:", friendId)
  console.log("Call API Send Request")
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      friendId: friendId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     friendId,
  //   }),
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to send request');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Send Response API
  Response: null
*/
export const fetchSendResponse = async ({token, id} : UserVerifyAccountRequest, {friendId, responseStatus} : SendResponse) => {
  const endpoint = BASE_URL + SEND_RESPONSE_URL
  console.log("Call API Send Response")
  console.log(endpoint)
  console.log("Body: ", {
    friendId: friendId,
    response: responseStatus
  })
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      friendId: friendId,
      response: responseStatus
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
  // const response = await fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     friendId,
  //     responseStatus,
  //   }),
  // })
  // if (!response.ok) {
  //   throw new Error('Failed to send response');
  // }
  // const data = await response.json();
  // return data.results;
}

/*
  Upload Picture
  Response: null
*/
export const fetchUploadPicture = async ({token, id} : UserVerifyAccountRequest, {pictureUri} : {pictureUri: string}) => {
  const endpoint = BASE_URL + POST_PICTURE_URL
  console.log("Call API Upload Picture")
  console.log(endpoint)
  console.log("Body: ", {
    profilePic: pictureUri
  })
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      profilePic: pictureUri
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Get Recent Message API
  Response: Messages
*/
interface RecentMessageRequest {
  target_id: string,
  limit: number,
}
export const fetchRecentMessage = async ({token, id} : UserVerifyAccountRequest, {target_id, limit}: RecentMessageRequest) => {
  const endpoint = SOCKET_BASE_URL + RECENT_MESSAGE_PERSONAL + `?user_id=${id}&target_id=${target_id}&limit=${limit}`;
  console.log("Call API Get Recent Message")
  console.log("Endpoint: ", endpoint)
  const response = await socketApi({
    method: 'GET',
    url: endpoint,
  })
  // console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Get Group Info
  Response: List<UserInformation>
*/
export const fetchGroupFullInfo = async ({token, id} : UserVerifyAccountRequest, {groupId}: {groupId: string}) => {
  const endpoint = BASE_URL + GET_GROUP_INFO_URL + `?id=${groupId}`
  console.log("Call API Get Group Info")
  console.log("Endpoint: ", endpoint)
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Leave Group
  Response: message
*/
export const fetchLeaveGroup = async ({token, id} : UserVerifyAccountRequest, {groupId} : {groupId: string}) => {
  const endpoint = BASE_URL + LEAVE_GROUP_URL
  console.log("Call API Upload Picture")
  console.log(endpoint)
  console.log("Body: ", {
    groupId: groupId
  })
  const response = await api({
    method: 'POST',
    url: endpoint,
    data: {
      groupId: groupId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Get Group List of user
  Response: List<UserInformation>
*/
export const fetchSearchGroupListOfUser = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_GROUP_LIST_USER_URL
  console.log("Call API Get List Of User")
  console.log("Endpoint: ", endpoint)
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}

/*
  Get Group List of user
  Response: List<UserInformation>
*/
export const fetchUserProfile = async ({token, id} : UserVerifyAccountRequest) => {
  const endpoint = BASE_URL + GET_PROFILE_URL + `?id=${id}`
  console.log("Call API Get User Profile")
  console.log("Endpoint: ", endpoint)
  const response = await api({
    method: 'GET',
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("Response: ", response)
  console.log("Data: ", response.data)
  const data = response.data;
  return data;
}
