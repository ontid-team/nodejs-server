export type CoderInfo = {
  streamAddress: string;
  port: number;
  streamKey: string;
  scope: string;
};

export type GetCoderInfoResponse = {
  name: string;
  scope: string;
  serverAddress: string;
  hostname: null | string;
  region: 'nyc1';
};
