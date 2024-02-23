export type MyAttendance = {
  _id: string;
  userId: string;
  clockIn: string;
  clockOut: string;
  serviceId?: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  campusName: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
  // user: IUser;
  score: number;
  // service: IService;
  CGWCId?: string;
  // campus: Pick<ICampus, '_id' | 'campusName'>;
};
export type TeamAttendance = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  clockIn: string;
  clockOut: string;
  serviceId?: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  campusName: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
  // user: IUser;
  score: number;
  // service: IService;
  CGWCId?: string;
  // campus: Pick<ICampus, '_id' | 'campusName'>;
};
