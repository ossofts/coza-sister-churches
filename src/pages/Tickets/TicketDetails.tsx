import {
  Drawer,
  DrawerContent,
  //   DrawerDescription,
  //   DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useRole from "@/hooks/useRoles";
import { ChangeEvent, Dispatch, useEffect, useMemo, useState } from "react";
import { Ticket, TicketStatus } from "./types";
import AvatarComponent from "@/components/AvatarComponent";
import { getFirstLetterCaps } from "@/utils/textFormatters";
import DetailItem from "./DetailItem";
import moment from "moment";
import { useGetUserById } from "@/services/account";
import BadgeComponent from "@/components/BadgeComponent";
import ReactIf from "@/components/ReactIf";
import { TextboxInput } from "@/components/Inputs";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  useContestTicket,
  useGetTicketById,
  useReplyContestTicket,
  useRetractTicket,
  useUpdateTicket,
} from "@/services/tickets";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import { FullPageSpinner } from "@/components/Loaders";

type Props = {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  ticket?: Ticket;
  refetch: () => void;
};

const TicketDetails = (props: Props) => {
  const { ticket: rowData } = props;
  const {
    isQC,
    // isCampusPastor,
    // isGlobalPastor,
    user: { userId, department },
  } = useRole();

  const {
    data: ticket,
    isFetching,
    isLoading,
    refetch,
  } = useGetTicketById(String(rowData?._id), {
    enabled: !!rowData?._id,
  });
  const { data: issuer, isLoading: issuerIsLoading } = useGetUserById(
    ticket?.issuedBy as string,
    {
      enabled: !!ticket?.issuedBy,
    }
  );

  const [contestComment, setContestComment] = useState("");
  const [contestReplyComment, setContestReplyComment] = useState(
    ticket?.contestReplyComment ?? ""
  );

  const contestTicketMutation = useContestTicket(String(ticket?._id));
  const replyContestMutation = useReplyContestTicket(String(ticket?._id));
  const retractTicketMutation = useRetractTicket(String(ticket?._id));
  const acknowledgeTicketMutation = useUpdateTicket(String(ticket?._id));

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContestComment(e?.target?.value);
  };

  const handleReplyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContestReplyComment(e?.target?.value);
  };

  const handleSubmit = () => {
    contestTicketMutation.mutate({
      userId,
      comment: contestComment as string,
    });
  };

  const handleReplySubmit = () => {
    replyContestMutation.mutate({
      userId,
      comment: contestReplyComment as string,
    });
  };

  const handleRetractTicket = () => {
    retractTicketMutation.mutate();
  };

  const handleAcknowledge = () => {
    acknowledgeTicketMutation.mutate({
      ...ticket,
      status: "ACKNOWLEDGED",
    } as Ticket);
  };

  useEffect(() => {
    if (contestTicketMutation.data) {
      showAlert("success", "Contest submitted");
      refetch();
      props.refetch();
      props.setOpen(false);
    }

    if (contestTicketMutation.error) {
      showAlert(
        "error",
        customError(contestTicketMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
  }, [contestTicketMutation.data, contestTicketMutation.error]);

  useEffect(() => {
    if (replyContestMutation.data) {
      showAlert("success", "Reply submitted");
      refetch();
      props.refetch();
      props.setOpen(false);
    }

    if (replyContestMutation.error) {
      showAlert(
        "error",
        customError(replyContestMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
  }, [replyContestMutation.data, replyContestMutation.error]);

  useEffect(() => {
    if (retractTicketMutation.data) {
      showAlert("success", "Retracted successfully");
      refetch();
      props.refetch();
      props.setOpen(false);
    }

    if (retractTicketMutation.error) {
      showAlert(
        "error",
        customError(retractTicketMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
  }, [retractTicketMutation.data, retractTicketMutation.error]);

  useEffect(() => {
    if (acknowledgeTicketMutation.data) {
      showAlert("success", "Ticket acknowledged");
      refetch();
      props.refetch();
      props.setOpen(false);
    }

    if (acknowledgeTicketMutation.error) {
      showAlert(
        "error",
        customError(acknowledgeTicketMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
  }, [acknowledgeTicketMutation.data, acknowledgeTicketMutation.error]);

  const qcAction = useMemo(() => {
    if (isQC && userId === ticket?.user?._id) {
      return false;
    }
    if (!isQC) {
      return false;
    }

    return true;
  }, [isQC, userId, ticket?.user?._id]);

  const offenderAction = useMemo(() => {
    if (userId === ticket?.user?._id) {
      return true;
    }
    if (ticket?.department?._id === department?._id && ticket?.isDepartment) {
      return true;
    }

    return false;
  }, [
    ticket?.department?._id,
    userId,
    ticket?.user?._id,
    ticket?.isDepartment,
    department?._id,
  ]);

  if (isFetching || isLoading) return <FullPageSpinner />;

  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent className="dark:bg-opacity-50 backdrop-blur-md max-h-svh overflow-hidden">
        <DrawerHeader className="">
          <DrawerTitle className="pt-5">Ticket Details</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col items-center overflow-auto h-[85%] mt-5 pb-10 px-5">
          {ticket?.user !== undefined && (
            <div className="flex justify-center items-center mb-5">
              <AvatarComponent
                src={ticket?.user?.pictureUrl ?? ""}
                fallback={`${getFirstLetterCaps(ticket?.user?.firstName)}${getFirstLetterCaps(ticket?.user?.lastName)}`}
                extraClass="w-20 h-20 font-semibold text-4xl"
              />
            </div>
          )}

          <DetailItem
            title="Date issued"
            value={moment(ticket?.createdAt).format("DD/MM/YYYY - LT")}
          />
          {ticket?.updatedAt ? (
            <DetailItem
              title="Last updated"
              value={moment(ticket?.updatedAt).format("DD/MM/YYYY - LT")}
            />
          ) : null}
          <DetailItem
            title="Department"
            value={ticket?.department?.departmentName}
          />
          <DetailItem
            title="Ticket type"
            value={ticket?.isDepartment ? "Departmental" : "Individual"}
          />

          {isQC && ticket?.issuedBy ? (
            <DetailItem
              isLoading={issuerIsLoading}
              title="Issued by"
              value={
                issuer?.data &&
                `${issuer?.data?.firstName} ${issuer?.data?.lastName}`
              }
            />
          ) : null}
          <DetailItem
            title="Status"
            value={
              <BadgeComponent status={ticket?.status as TicketStatus}>
                {ticket?.status}
              </BadgeComponent>
            }
          />
          <DetailItem title="Category" value={ticket?.category?.categoryName} />
          <DetailItem
            title="Offender"
            value={
              ticket?.isIndividual
                ? `${ticket?.user?.firstName} ${ticket?.user?.lastName}`
                : `${ticket?.department?.departmentName}`
            }
          />
          <DetailItem
            align="vertical"
            title="Details"
            value={ticket?.ticketSummary}
          />
          <DetailItem
            align="vertical"
            title="Contest Comment"
            divider={false}
            value={
              <ReactIf
                condition={!!ticket?.contestComment}
                component={ticket?.contestComment}
                fallback={
                  <TextboxInput
                    name="constestComment"
                    value={contestComment}
                    optional
                    onChange={handleChange}
                    inputProps={{
                      disabled:
                        ticket?.status !== "ISSUED" ||
                        ticket?.user?._id !== userId,
                    }}
                  />
                }
              />
            }
          />
          <DetailItem
            align="vertical"
            title="QC / M&E Reply"
            divider={false}
            value={
              <ReactIf
                condition={!!ticket?.contestReplyComment}
                component={ticket?.contestReplyComment}
                fallback={
                  <TextboxInput
                    name="contestReplyComment"
                    value={contestReplyComment}
                    optional
                    onChange={handleReplyChange}
                    inputProps={{
                      disabled:
                        !isQC ||
                        userId === ticket?.user?._id ||
                        !!ticket?.contestReplyComment,
                    }}
                  />
                }
              />
            }
          />

          <ReactIf
            condition={offenderAction}
            component={
              <div className="grid gap-5 grid-cols-2 w-full mt-5">
                <SecondaryButton
                  isLoading={contestTicketMutation.isPending}
                  className="text-xs h-10"
                  disabled={
                    (!contestComment || !!ticket?.contestComment) &&
                    (ticket?.status === "ISSUED" ||
                      ticket?.status === "ACKNOWLEDGED" ||
                      ticket?.status === "CONTESTED")
                  }
                  onClick={handleSubmit}
                >
                  Contest
                </SecondaryButton>
                <PrimaryButton
                  isLoading={acknowledgeTicketMutation.isPending}
                  className="text-xs h-10"
                  disabled={
                    ticket?.status !== "ISSUED" &&
                    (userId !== ticket?.user?._id ||
                      String(ticket?.department?._id ?? "") !==
                        String(department?._id ?? ""))
                  }
                  onClick={handleAcknowledge}
                >
                  Acknowledge
                </PrimaryButton>
              </div>
            }
          />
          <ReactIf
            condition={qcAction}
            component={
              <div className="grid gap-5 grid-cols-2 w-full mt-5">
                <SecondaryButton
                  isLoading={retractTicketMutation.isPending}
                  className="text-xs h-10"
                  onClick={handleRetractTicket}
                >
                  Retract
                </SecondaryButton>
                <PrimaryButton
                  isLoading={replyContestMutation.isPending}
                  className="text-xs h-10"
                  onClick={handleReplySubmit}
                  disabled={!contestReplyComment}
                >
                  Reply
                </PrimaryButton>
              </div>
            }
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TicketDetails;
