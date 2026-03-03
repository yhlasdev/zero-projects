import { IconButton } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import { AiOutlineEdit } from "react-icons/ai";
import { CgEye } from "react-icons/cg";

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
          <CalendarMonthSharpIcon />
        </IconButton>
      )}
      {onEdit && (
        <IconButton size="small" onClick={onEdit}>
          <AiOutlineEdit size={20.5} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <DeleteForeverOutlinedIcon sx={{fontSize: 20}}/>
        </IconButton>
      )}
    </>
  );
}
