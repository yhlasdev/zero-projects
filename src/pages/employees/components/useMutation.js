import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "../../../api/queries/delete";
import toast from "react-hot-toast";

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSchedule(id),

    onSuccess: () => {
      toast.success("Schedule deleted successfully ✅");

      queryClient.invalidateQueries({
        queryKey: ["employee-week-schedule"],
      });
    },

    onError: () => {
      toast.error("Failed to delete schedule ❌");
    },
  });
};
