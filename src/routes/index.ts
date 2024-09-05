import { roles } from "@/hooks/useRoles";
import { lazy } from "react";
import * as React from "react";
import { Navigate } from "react-router-dom";

const Welcome = lazy(() => import("@/pages/AuthForms/Welcome"));
const Login = lazy(() => import("@/pages/AuthForms/Login"));
const Register = lazy(() => import("@/pages/AuthForms/Register"));
const ForgotPassword = lazy(() => import("@/pages/AuthForms/ForgotPassword"));
const Home = lazy(() => import("@/pages/Home"));
const Attendance = lazy(() => import("@/pages/Attendance"));
const Tickets = lazy(() => import("@/pages/Tickets"));
const IssueTicket = lazy(() => import("@/pages/Tickets/IssueTicket"));
const Cgwc = lazy(() => import("@/pages/Cgwc"));
const CgwcDetails = lazy(() => import("@/pages/Cgwc/CgwcDetails"));
const CgwcResources = lazy(() => import("@/pages/Cgwc/CgwcResources"));
const CreateCgwc = lazy(() => import("@/pages/Cgwc/CreateCgwc"));
const CreateCgwcSession = lazy(
  () => import("@/pages/Cgwc/CgwcDetails/CreateCGWCSession")
);
const CreateInstantMessage = lazy(
  () => import("@/pages/Cgwc/CgwcDetails/CreateInstantMessage")
);
const Profile = lazy(() => import("@/pages/Profile"));
const ServiceManagement = lazy(() => import("@/pages/ServiceManagement"));
const ManualClockIn = lazy(() => import("@/pages/ManualClockIn"));
const AttendanceConfirmation = lazy(
  () => import("@/pages/AttendanceConfirmation")
);
const ExportData = lazy(() => import("@/pages/ExportData"));
const CreateUser = lazy(() => import("@/pages/WorkforceManagement/CreateUser"));
const CreateDepartment = lazy(
  () => import("@/pages/WorkforceManagement/CreateDepartment")
);
const WorkforceSummary = lazy(() => import("@/pages/WorkforceSummary"));
const WorkforceSummaryDepartments = lazy(
  () => import("@/pages/WorkforceSummary/DepartmentList")
);

export type RouteObj = {
  path: string;
  isPrivate: boolean;
  component: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | React.LazyExoticComponent<(...props: any) => JSX.Element>
    | (() => JSX.Element)
    | (() => null);
  title: string;
  roles?: string[];
};

const ROUTES: Record<string, RouteObj> = {
  WELCOME: {
    path: "/",
    isPrivate: false,
    component: Welcome,
    title: "Welcome",
  },
  LOGIN: {
    path: "/login",
    isPrivate: false,
    component: Login,
    title: "Login",
  },
  REGISTER: {
    path: "/register",
    isPrivate: false,
    component: Register,
    title: "Register",
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    isPrivate: false,
    component: ForgotPassword,
    title: "ForgotPassword",
  },
  HOME: {
    path: "/home",
    isPrivate: true,
    component: Home,
    title: "Home",
    roles: [...Object.values(roles)],
  },
  ATTENDANCE: {
    path: "/attendance",
    isPrivate: true,
    component: Attendance,
    title: "Attendance",
    roles: [...Object.values(roles)],
  },
  TICKETS: {
    path: "/tickets",
    isPrivate: true,
    component: Tickets,
    title: "Tickets",
    roles: [...Object.values(roles)],
  },
  ISSUE_TICKETS: {
    path: "/tickets/issue-ticket",
    isPrivate: true,
    component: IssueTicket,
    title: "Issue Ticket",
    roles: [roles.QC, roles["Super Admin"]],
  },
  CGWC: {
    path: "/cgwc",
    isPrivate: true,
    component: Cgwc,
    title: "CGWC",
    roles: [...Object.values(roles)],
  },
  CGWC_DETAILS: {
    path: "/cgwc/:id",
    isPrivate: true,
    component: CgwcDetails,
    title: "CGWC",
    roles: [...Object.values(roles)],
  },
  CGWC_RESOURCES: {
    path: "/cgwc/cgwc-resources",
    isPrivate: true,
    component: CgwcResources,
    title: "CGWC",
  },
  CREATE_CGWC: {
    path: "/cgwc/create-cgwc",
    isPrivate: true,
    component: CreateCgwc,
    title: "Create CGWC",
    roles: [roles["Super Admin"]],
  },
  CREATE_CGWC_SESSION: {
    path: "/cgwc/:id/create-cgwc-session",
    isPrivate: true,
    component: CreateCgwcSession,
    title: "Create CGWC Session",
    roles: [roles["Super Admin"]],
  },
  CREATE_INSTANT_MESSAGE: {
    path: "/cgwc/:id/create-instant-message",
    isPrivate: true,
    component: CreateInstantMessage,
    title: "Create Instant Message",
    roles: [roles["Super Admin"]],
  },
  PROFILE: {
    path: "/profile",
    isPrivate: true,
    component: Profile,
    title: "Profile",
    roles: [...Object.values(roles)],
  },
  SERVICE_MANAGEMENT: {
    path: "/service-management",
    isPrivate: true,
    component: ServiceManagement,
    title: "Service Management",
    roles: [
      roles["Super Admin"],
      roles["Global Admin"],
      roles["Global Pastor"],
    ],
  },
  MANUAL_CLOCK_IN: {
    path: "/manual-clock-in",
    isPrivate: true,
    component: ManualClockIn,
    title: "Manual Clock In",
    roles: [
      roles["Super Admin"],
      roles.QC,
      roles.Internship,
      roles["Internship HOD"],
    ],
  },
  ATTENDANCE_CONFIRMATION: {
    path: "/attendance-confirmation",
    isPrivate: true,
    component: AttendanceConfirmation,
    title: "Attendance Confirmation",
    roles: [
      roles["Super Admin"],
      roles.QC,
      roles.Internship,
      roles["Internship HOD"],
    ],
  },
  EXPORT_DATA: {
    path: "/export-data",
    isPrivate: true,
    component: ExportData,
    title: "Export Data",
    roles: [...Object.values(roles).filter((item) => item !== roles.Worker)],
  },
  CREATE_USER: {
    path: "/create-user",
    isPrivate: true,
    component: CreateUser,
    title: "Create User",
    roles: [
      roles["Super Admin"],
      roles["Global Admin"],
      roles["Global Pastor"],
      roles["Internship HOD"],
    ],
  },
  CREATE_DEPARTMENT: {
    path: "/create-department",
    isPrivate: true,
    component: CreateDepartment,
    title: "Create Department",
    roles: [
      roles["Super Admin"],
      roles["Global Admin"],
      roles["Global Pastor"],
    ],
  },
  WORKFORCE_SUMMARY: {
    path: "/workforce-summary",
    isPrivate: true,
    component: WorkforceSummary,
    title: "Workforce Summary",
    roles: [roles["Super Admin"], roles["HOD"], roles["Global Pastor"]],
  },
  WORKFORCE_SUMMARY_DEPARTMENT: {
    path: "/workforce-summary/:department_id",
    isPrivate: true,
    component: WorkforceSummaryDepartments,
    title: "Workforce Summary",
    roles: [roles["Super Admin"], roles["Global Pastor"]],
  },
  GO_TO_HOME: {
    title: "Go home",
    path: "/",
    isPrivate: true,
    component: () =>
      Navigate({
        to: "/home",
        replace: true,
      }),
    roles: [...Object.values(roles)],
  },
  REDIRECT_: {
    title: "Go home",
    path: "*",
    isPrivate: true,
    component: () =>
      Navigate({
        to: "/",
        replace: true,
      }),
    roles: [...Object.values(roles)],
  },
  REDIRECT: {
    title: "Go home",
    path: "*",
    isPrivate: false,
    component: () =>
      Navigate({
        to: "/",
        replace: true,
      }),
    roles: [...Object.values(roles)],
  },
};

export default ROUTES;
