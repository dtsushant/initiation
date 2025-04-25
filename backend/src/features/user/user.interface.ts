export interface IUserData {
  bio: string;
  email: string;
  image?: string;
  token: string;
  username: string;
  roles?: string[];
}

export interface IUserRO {
  user: IUserData;
}
