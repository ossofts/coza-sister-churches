export type CreateService = {
  _id?: string;
  name: string;
  coordinates: {
    long: number;
    lat: number;
  };
  CGWCId?: string;
  isCGWC?: boolean;
  tag: string[];
  serviceTime: number | null;
  clockInStartTime: number | null;
  workersLateStartTime: number | null;
  leadersLateStartTime: number | null;
  serviceEndTime: number | null;
  rangeToClockIn: number;
  isGlobalService: boolean;
};

export type CreateServicePayload = {
  serviceType: string;
  name: string;
  serviceTag: string;
  serviceTime: string | Date;
  serviceDate: string | Date;
  endTime: string | Date;
  isCGWC?: boolean;
  CGWCId?: string;
  clockinTime: string | Date;
  leaderLateTime: string | Date;
  workerLateTime: string | Date;
  isGlobalService: boolean;
};
