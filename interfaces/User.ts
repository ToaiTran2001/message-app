export interface UserSignInRequest {
  username: string;
  password: string;
}

export interface UserSignUpRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserVerifyAccountRequest {
  token: string;
  id: number;
}

export interface UserProfileRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  profilePic: string;
}

export interface UserInformation {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  profilePic: string;
}

export interface UserSignUpResponse {
  message: string;
  id: number;
}

export interface UserSignInResponse {
  token: string;
  user: UserInformation;
}

export interface UserVerifyAccountResponse {
  token: string;
  user: UserInformation;
}
