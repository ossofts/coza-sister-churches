import { useMutation } from "@tanstack/react-query";
import axiosClient from "../client";

export const usePostFcmToken = () => {
  return useMutation({
    mutationKey: ["notification"],
    mutationFn: (body: { email: string; deviceId: string; fcmToken: string }) =>
      axiosClient.post(`/account/addDeviceToken`, body),
  });
};
