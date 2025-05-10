type TFindUserParams = Partial<{
  id: string;
  username: string;
  email: string;
}>;

type TFindUserOptions = {
  selectAll: boolean;
};

export type TFindUserDetails = {
  params: TFindUserParams;
  options: TFindUserOptions;
};

export type TUserReponse = {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
};
