import { Box, Typography, Paper } from "@mui/material";
import { useLocale } from "../../hooks/useLocale";

export default function TablePaginationInfo({
  total = 0,
  page = 1,
  limit = 10,
  onChange,
}) {
  const { t } = useLocale();
  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);

  const handleChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (onChange) onChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderRadius: "0 0 10px 10px",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t("common.showing", { defaultValue: "Showing" })} {startItem} - {endItem} {t("common.of", { defaultValue: "of" })} {total}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* Previous */}
        <Box
          onClick={() => handleChange(page - 1)}
          sx={{
            px: 1.5,
            py: 0.5,
            fontWeight: 500,
            cursor: page === 1 ? "default" : "pointer",
            color: page === 1 ? "text.secondary" : "text.disabled",
            fontSize: "14px",
            userSelect: "none",
            "&:hover": page !== 1 ? { color: "primary.main" } : {},
          }}
        >
          {t("common.previous", { defaultValue: "Previous" })}
        </Box>

        {getPageNumbers().map((p) => (
          <Box
            key={p}
            onClick={() => handleChange(p)}
            sx={{
              width: 33,
              height: 33,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: p === page ? 600 : 400,
              backgroundColor: p === page ? "#0F3254" : "transparent",
              color: p === page ? "#fff" : "text.primary",
              userSelect: "none",
              "&:hover": {
                backgroundColor: p === page ? "#1a2b45" : "action.hover",
              },
            }}
          >
            {p}
          </Box>
        ))}

        {/* Next */}
        <Box
          onClick={() => handleChange(page + 1)}
          sx={{
            px: 1.5,
            py: 0.5,
            cursor: page === totalPages ? "default" : "pointer",
            color: page === totalPages ? "text.secondary" : "text.disabled",
            fontSize: "14px",
            fontWeight: 600,
            userSelect: "none",
            "&:hover": page !== totalPages ? { color: "primary.main" } : {},
          }}
        >
          {t("common.next", { defaultValue: "Next" })}
        </Box>
      </Box>
    </Paper>
  );
}