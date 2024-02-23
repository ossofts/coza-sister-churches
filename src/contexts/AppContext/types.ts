export type Service = {
  _id: string;
  name: string;
  campusId: string;
  coordinates: {
    long: number;
    lat: number;
  };
  tag: string[];
  serviceTime: string;
  clockInStartTime: string;
  clockInEndTime: string;
  workersLateStartTime: string;
  leadersLateStartTime: string;
  serviceEndTime: string;
  rangeToClockIn: number;
  createdAt: string;
  CGWCId?: string;
  isCGWC?: boolean;
  isGlobalService: boolean;
  __v: number;
  campus: {
    LGA: string;
    __v: number;
    _id: string;
    address: string;
    campusName: string;
    country: string;
    createdAt: string;
    dateOfBirth: string | null;
    description: string;
    state: string;
    updatedAt: string;
  };
};
