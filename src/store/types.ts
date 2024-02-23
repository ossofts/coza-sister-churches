export enum AttendanceStatus {
  LATE = "LATE",
  ABSENT = "ABSENT",
  PRESENT = "PRESENT",
  ABSENT_WITH_PERMISSION = "ABSENT_WITH_PERMISSION"
}

export type Role = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  __v: number;
};

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

export type Department = {
  _id: string;
  departmentName: string;
  campusId: string;
  description: string;
  createdAt: string;
  __v: number;
};

export type Log = {
  dateCreated?: string;
  createdAt?: string;
  dateUpdated?: string;
  updatedAt?: string;
};

export type Campus = Log & {
  coordinates: {
    long: number;
    lat: number;
  };
  location?: {
    long: number;
    lat: number;
  };
  _id: string;
  campusName: string;
  description: string;
  address: string;
  LGA: string;
  state: string;
  country: string;
  dateOfBirth: null | string;
  createdAt: string;
};

export type UserStatus = "ACTIVE" | "DORMANT" | "INACTIVE" | "HOD" | "AHOD" | "UNAPPROVED";

export type User = {
  _id: string;
  userId: string;
  address: string;
  birthDay: string;
  createdAt: string;
  email: string;
  firstName: string;
  gender: "M" | "F";
  isActivated: boolean;
  isVerified: boolean;
  lastName: string;
  maritalStatus: string;
  nextOfKin: string;
  isCGWCApproved?: boolean;
  nextOfKinPhoneNo: string;
  occupation: string;
  phoneNumber: string;
  pictureUrl: string;
  qrCodeUrl: string;
  placeOfWork: string;
  role: Role;
  roleId: Role["_id"];
  department: Department;
  campus: Campus;
  status: UserStatus;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
};

export type Attendance = {
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
  user: User;
  score: number;
  service: Service;
  CGWCId?: string;
  campus: Pick<Campus, "_id" | "campusName">;
};

export type ClockInPayload = {
  userId: string;
  clockIn: string | null;
  clockOut: string | null;
  serviceId: string;
  coordinates: {
    lat: string;
    long: string;
  };
  roleId: User["role"]["_id"];
  campusId: Campus["_id"];
  departmentId: string;
};

export type DefaultQueryParams = {
  departmentId?: Department["_id"];
  serviceId?: Service["_id"];
  startDate?: number | string;
  endDate?: number | string;
  campusId?: Campus["_id"];
  requestor?: User["_id"];
  userId?: User["_id"];
  roleId?: Role["_id"];
  CGWCId?: string;
  cgwcId?: string;
  limit?: number;
  page?: number;
  status?: AttendanceStatus;
};

export type CGWC = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type Status = "APPROVED" | "DECLINED" | "PENDING" | "REVIEW_REQUESTED" | "REJECTED";

export type CGWCInstantMessage = {
  _id: string;
  title: string;
  CGWCId: string;
  message: string;
  status: Status;
  imageUrl: string;
  createdAt: string;
  messageLink: string;
};

export const CGWC_SESSION_TAGS = [
  { id: "CGWC_MORNING_SESSION", value: "Morning Session" },
  { id: "CGWC_EVENING_SESSION", value: "Evening Session" },
  { id: "CGWC_AFTERNOON_SESSION", value: "Afternoon Session" },
  { id: "CGWC_HANGOUT_SESSION", value: "Hangout Session" },
  { id: "CGWC_DINNER_SESSION", value: "Dinner Session" },
  { id: "CGWC_LADIES_SESSION", value: "Ladies Session" },
  { id: "CGWC_EVANGELISM_SESSION", value: "Evangelism Session" },
  { id: "CGWC_BREAKOUT_SESSION", value: "Breakout Session" }
];
