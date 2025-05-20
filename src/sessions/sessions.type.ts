export type TCreateSessionParams = Partial<{
  userId: string;
  jit: string;
  deviceName: string;
  deviceId: string;
}>;

export type TFindSessionByParams = {
  userId: string;
  jit: string;
};
