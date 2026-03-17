import { IconButton } from "@mui/material";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import { AiOutlineEdit } from "react-icons/ai";
import { CgEye } from "react-icons/cg";
import { RiDeleteBinLine } from "react-icons/ri";

export default function TableActions({
  onView,
  onEdit,
  onDelete,
  onCalendar,
}) {
  return (
    <>
      {onView && (
        <IconButton size="small" onClick={onView}>
          <CgEye  sx={{fontSize: 20}}/>
        </IconButton>
      )}
      {onCalendar && (
        <IconButton size="small" onClick={onCalendar} sx={{fontSize: 18}}>
          <CalendarMonthSharpIcon sx={{fontSize: 18}}/>
        </IconButton>
      )}
      {onEdit && (
        <IconButton size="small" onClick={onEdit}>
          <AiOutlineEdit size={20.5} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <RiDeleteBinLine sx={{fontSize: 20}}/>
        </IconButton>
      )}
    </>
  );
}
