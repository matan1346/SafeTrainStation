export interface IAlert{
  id: string;
  cameraID: string;
  fileID: string;
  s3Upload: boolean;
  seen: boolean;
  registeredDate: Date;
};

export type Alert = IAlert;
