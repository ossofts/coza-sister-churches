import { Campus, Department, Log, Service, User } from "@/store/types";

export type TicketStatus =
  | "ISSUED"
  | "CONTESTED"
  | "RETRACTED"
  | "ACKNOWLEDGED";
export type TicketCategory = {
  _id: string;
  categoryName: string;
  description: string;
  createdAt: string;
};

export type Ticket = Log & {
  _id: string;
  user: User;
  remarks: string;
  issuedBy?: string;
  createdAt: string;
  CGWCId?: string;
  isRetracted: boolean;
  ticketSummary: string;
  status: TicketStatus;
  isDepartment: boolean;
  isIndividual: boolean;
  contestComment: string;
  department: Department;
  category: TicketCategory;
  departmentName: string;
  departmentId: string;
  contestReplyComment: string;
  campus: Pick<Campus, "_id" | "campusName">;
  // screen: { name: string; value: string } | undefined;
};

export type CreateTicketPayload = {
  _id?: string;
  serviceId?: Service["_id"];
  departmentId: Department["_id"];
  campusId: Campus["_id"];
  userId?: User["_id"];
  categoryId: string;
  isCampus: boolean;
  isDepartment: boolean;
  isIndividual: boolean;
  isRetracted: boolean;
  ticketSummary: string;
  status?: TicketStatus;
  issuedBy: User["_id"];
};

export type TicketUpdatePayload = {
  userId: User["_id"];
  // _id: Ticket["_id"];
  comment: string;
};
