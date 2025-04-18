export interface GroupInformationRequest {
  groupName: string;
  groupPic: string;
  member: string[];
  freeTalk: boolean;
  freeInvite: boolean;
}

export interface GroupInformationResponse {
  id: string;
  groupName: string;
  groupPic: string;
  owner: string;
  freeTalk: boolean;
  freeInvite: boolean;
}

export interface CreateGroupResponse {
  message: string;
  results: GroupInformationResponse;
}

export interface GroupInformationWithMemberResponse {
  id: string;
  groupName: string;
  groupPic: string;
  owner: string;
  freeTalk: boolean;
  freeInvite: boolean;
  role: string;
  createdAt: string;
}