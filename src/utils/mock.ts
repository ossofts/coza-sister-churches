import { User } from "@/store/types";

export const mockUser: User = {
  _id: "hjdsbfjnfkjfns",
  userId: "jdhsfkjdsnflkdf",
  address: "18a Olayinka Street",
  birthDay: "15-12-2024",
  createdAt: "11-02-2024",
  email: "oluwaferanmi12@gmail.com",
  firstName: "Toluwalope",
  gender: "M",
  isActivated: true,
  isVerified: true,
  lastName: "Adeoye",
  maritalStatus: "Married",
  nextOfKin: "Omomayowa",
  isCGWCApproved: true,
  nextOfKinPhoneNo: "07058725271",
  occupation: "Software Engineer",
  phoneNumber: "07058725271",
  pictureUrl:
    "https://res.cloudinary.com/der5ebp5m/image/upload/v1708089749/random/IMG_4367_Copy_ysshrj.jpg",
  qrCodeUrl: "",
  placeOfWork: "some place",
  role: {
    _id: "fffgfgfgdf",
    name: "sister church",
    description: "",
    createdAt: "",
    __v: 8
  },
  roleId: "fdsfdsf",
  department: {
    _id: "string",
    departmentName: "GLCC",
    campusId: "string;",
    description: "string;",
    createdAt: "string;",
    __v: 6
  },
  campus: {
    coordinates: {
      long: 6.34656867,
      lat: 2.35657898
    },
    _id: "string",
    campusName: "Lagos",
    description: "string",
    address: "string",
    LGA: "string",
    state: "string",
    country: "string",
    dateOfBirth: "",
    createdAt: "string"
  },
  status: "ACTIVE",
  socialMedia: {
    facebook: "",
    instagram: "",
    twitter: ""
  }
};

export const random = {
  _id: "hjdsbfjnfkjfns",
  userId: "jdhsfkjdsnflkdf",
  createdAt: "16-02-2024",
  email: "toluade1512@gmail.com",
  firstName: "Toluwalope",
  gender: "M",
  isActivated: true,
  isVerified: true,
  lastName: "Adeoye",
  maritalStatus: "Married",
  isCGWCApproved: true,
  occupation: "Software Engineer",
  phoneNumber: "07058725271",
  pictureUrl:
    "https://res.cloudinary.com/der5ebp5m/image/upload/v1708089749/random/IMG_4367_Copy_ysshrj.jpg",
  role: {
    _id: "sister_church",
    name: "Sister Church",
    description: "",
    createdAt: "16-02-2024"
  },
  roleId: "sister_church",
  campus: {
    coordinates: {
      long: 6.34656867,
      lat: 2.35657898
    },
    _id: "string",
    campusName: "GLCC"
  },
  status: "ACTIVE"
};
