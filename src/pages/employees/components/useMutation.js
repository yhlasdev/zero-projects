import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "../../../api/queries/delete";
import { toast } from "react-toastify";
import { useLocale } from "../../../hooks/useLocale";

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  const { t } = useLocale();

  return useMutation({
    mutationFn: (id) => deleteSchedule({ schedule_id: id }),

    onSuccess: () => {
      toast.success(t("employees.scheduleDeleted"));

      queryClient.invalidateQueries({
        queryKey: ["weekly-schedule"],
      });
    },

    onError: () => {
      toast.error(t("employees.scheduleDeleteFail"));
    },
  });
};
