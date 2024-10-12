import PageHeader from "@/components/PageHeader";
// import { Status } from "@/store/types";
import { useParams } from "react-router-dom";
import { createInstantMessageSchema } from "../validation";
import { useForm } from "react-hook-form";
import useNavigation from "@/hooks/useNavigation";
import { TextInputWithIcon, TextboxInput } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import { Spinner } from "@/components/Loaders";
import { useCreateInstantMessageMutation } from "@/services/cgwc";
import { useEffect } from "react";
import showAlert from "@/hooks/useAlert";
import ROUTES from "@/routes";
import { customError } from "@/types/global.type";

export type CGWCInstantMessagePayload = {
  title: string;
  CGWCId: string;
  cgwcId?: string;
  message: string;
  // status: Status;
  messageLink: string;
  imageUrl: string;
};

const CreateInstantMessage = () => {
  const { id } = useParams();

  const navigation = useNavigation();

  const mutation = useCreateInstantMessageMutation();
  const form = useForm<
    Pick<
      CGWCInstantMessagePayload,
      "title" | "message" | "messageLink" | "imageUrl"
    >
  >({
    resolver: createInstantMessageSchema,
    defaultValues: {
      title: "",
      message: "",
      messageLink: "",
    },
  });
  const { register, handleSubmit, formState } = form;

  const onSubmit = (
    data: Pick<
      CGWCInstantMessagePayload,
      "title" | "message" | "messageLink" | "imageUrl"
    >
  ) => {
    const body = {
      CGWCId: String(id),
      title: data.title,
      message: data.message,
      messageLink: data.messageLink,
      imageUrl: data.imageUrl,
      // status: "PENDING" as Status,
    };
    mutation.mutate(body);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Message created successfully");
      navigation.goto(`${ROUTES.CGWC.path}/${id}`);
    }
    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ??
          "Oops! Something went wrong."
      );
    }
  }, [mutation.data, mutation.error]);

  return (
    <div className="px-5">
      <PageHeader title="Create Instant Message" />
      <form
        className="flex flex-col gap-2 pt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInputWithIcon
          label="Title"
          name="title"
          placeholder="Enter title"
          type="text"
          register={register}
          error={formState.errors.title}
          inputProps={{ autoComplete: "off", type: "text", required: true }}
        />
        <TextboxInput
          label="Message"
          name="message"
          placeholder="Enter message"
          register={register}
          error={formState.errors.message}
          inputProps={{ autoComplete: "off", required: true }}
        />
        <TextInputWithIcon
          label="Message Link"
          name="messageLink"
          placeholder="Enter message link"
          type="url"
          register={register}
          error={formState.errors.messageLink}
          inputProps={{ autoComplete: "off", type: "text", required: true }}
        />
        <TextInputWithIcon
          label="Image Url"
          name="imageUrl"
          placeholder="Enter image url"
          type="url"
          register={register}
          error={formState.errors.imageUrl}
          inputProps={{ autoComplete: "off", type: "text", required: true }}
        />

        <PrimaryButton className="mt-2" type="submit">
          {mutation.isPending ? <Spinner /> : "Post Instant Message"}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default CreateInstantMessage;
