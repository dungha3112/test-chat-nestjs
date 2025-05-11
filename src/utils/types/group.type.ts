export type TCreateGroupParams = {
  users: string[];
  title: string;
  ownerId: string;
};
export type TCheckUserInGroupParams = {
  id: string;
  userId: string;
};
