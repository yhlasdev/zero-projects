import { Button } from "@mui/material";

export default function HeaderButton({
  children,
  icon,
  width = 200,
  ...props
}) {
  return (
    <Button
      variant="contained"
      sx={{ maxWidth: width, borderRadius: "8px", fontSize: "12px"}}
      startIcon={icon}
      {...props}
    >
      {children}
    </Button>
  );
}
