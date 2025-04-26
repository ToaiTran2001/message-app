export interface GroupInformationRequest {
  groupName: string;
  groupPic: string;
  member: string[];
  freeTalk: boolean;
  freeInvite: boolean;
}

export interface GroupInformationResponse {
  id: number;
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
  id: number;
  groupName: string;
  groupPic: string;
  owner: string;
  freeTalk: boolean;
  freeInvite: boolean;
  role: string;
  createdAt: string;
}

export interface GroupFullInfoResponse {
  id: number;
  group_name: string;
  group_pic: string;
  owner: any;
  free_talk: boolean;
  free_invite: boolean;
  created_at: string;
  members: any[];
  member_count: number;
}