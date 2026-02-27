import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAppMutation = ({
  mutationFn,
  queryKey,
  onSuccess,
  invalidate = true,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: (data, variables, context) => {
      if (invalidate && queryKey) {
        queryClient.invalidateQueries({
          queryKey: queryKey,
          exact: false,
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }

      toast.success(data?.data?.message || 'Succesfully');

    },

    onError: (error) => {
      console.log('ERROR')
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    },
  });
};