import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Checkbox,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { useState, useMemo } from "react";
import dayjs from "dayjs";

const fmt = (val) => {
  if (val === null || val === undefined) return "-";
  return String(val);
};
const fmtTime = (val) => {
  if (!val) return "-";
  return dayjs(val).format("HH:mm");
};
const fmtHours = (val) => {
  if (!val && val !== 0) return "-";
  const n = Number(val);
  if (n === 0) return "-";
  return n % 1 === 0 ? n + "h" : n.toFixed?.(2) + "h";
};
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};
const AVATAR_COLORS = [
  "#4f8ef7",
  "#f7904f",
  "#4fc9a4",
  "#f74f6a",
  "#a04ff7",
  "#f7c94f",
  "#4fe0f7",
  "#f74fbd",
];
const avatarColor = (id) =>
  AVATAR_COLORS[Number(String(id).slice(-1)) % AVATAR_COLORS.length];
const statusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "present") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "late") return { bg: "#fef9c3", color: "#ca8a04" };
  if (s === "absent") return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#f1f5f9", color: "#64748b" };
};

// Single source of truth - header and rows both use this
const GRID = "36px 72px 1.8fr 1fr 1.4fr 72px 80px 60px 90px";

export default function BulkExportModal({ open, onClose, rows = [], date }) {
  const [selected, setSelected] = useState(
    () => new Set(rows.map((r) => r.attendance_id)),
  );

  const allSelected = selected.size === rows.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.attendance_id)));
  };
  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectedRows = useMemo(
    () => rows.filter((r) => selected.has(r.attendance_id)),
    [rows, selected],
  );
  const stats = useMemo(() => {
    const present = selectedRows.filter(
      (r) => (r.status || "").toLowerCase() === "present",
    ).length;
    const late = selectedRows.filter(
      (r) => (r.status || "").toLowerCase() === "late",
    ).length;
    const absent = selectedRows.filter(
      (r) => (r.status || "").toLowerCase() === "absent",
    ).length;
    const totalH = selectedRows.reduce((a, r) => a + (Number(r.hours) || 0), 0);
    const avgH = selectedRows.length > 0 ? totalH / selectedRows.length : 0;
    return { present, late, absent, totalH, avgH };
  }, [selectedRows]);

  const displayDate = date
    ? dayjs(date).format("DD.MM.YYYY")
    : dayjs().format("DD.MM.YYYY");

  const handleExport = () => {
    const s = fmt;
    const runExport = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = 210;
      const margin = 14;
      const colW = pageW - margin * 2;
      doc.setFillColor(13, 37, 64);
      doc.rect(0, 0, pageW, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Yerinde", margin, 9);
      doc.setFontSize(7);
      doc.text("Workforce Management", margin, 14);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Attendance Report", pageW / 2, 10, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Daily Check-in / Check-out Records", pageW / 2, 16, {
        align: "center",
      });
      doc.setFontSize(7);
      doc.setTextColor(160, 200, 255);
      doc.text("Date", pageW - margin, 7, { align: "right" });
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(dayjs(date).format("DD MMMM YYYY"), pageW - margin, 13, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        "Exported: " + dayjs().format("DD.MM.YYYY HH:mm"),
        pageW - margin,
        18,
        { align: "right" },
      );
      const sY = 32;
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.rect(margin, sY, colW, 16);
      const statItems = [
        { label: "TOTAL EMP", value: s(selectedRows.length) },
        { label: "PRESENT", value: s(stats.present), color: [34, 140, 80] },
        { label: "LATE", value: s(stats.late), color: [202, 138, 4] },
        { label: "ABSENT", value: s(stats.absent), color: [220, 38, 38] },
        { label: "TOTAL HOURS", value: stats.totalH.toFixed(2) + "h" },
        { label: "AVG HOURS", value: stats.avgH.toFixed(2) + "h" },
      ];
      const sW = colW / statItems.length;
      statItems.forEach((st, i) => {
        const x = margin + i * sW + sW / 2;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        if (st.color) doc.setTextColor(...st.color);
        else doc.setTextColor(13, 37, 64);
        doc.text(st.value, x, sY + 7, { align: "center" });
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 130, 150);
        doc.text(st.label, x, sY + 12, { align: "center" });
        if (i > 0) {
          doc.setDrawColor(220, 225, 235);
          doc.line(margin + i * sW, sY, margin + i * sW, sY + 16);
        }
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 40);
      doc.text("Employee Attendance Details", margin, sY + 24);
      const tY = sY + 28;
      const cols = [
        { label: "ID", w: 18 },
        { label: "Employee", w: 35 },
        { label: "Department", w: 28 },
        { label: "Position", w: 35 },
        { label: "Check In", w: 18 },
        { label: "Check Out", w: 18 },
        { label: "Hours", w: 14 },
        { label: "Status", w: 0 },
      ];
      const usedW = cols.slice(0, -1).reduce((a, c) => a + c.w, 0);
      cols[cols.length - 1].w = colW - usedW;
      doc.setFillColor(245, 247, 250);
      doc.setDrawColor(220, 225, 235);
      doc.rect(margin, tY, colW, 7, "FD");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 110, 130);
      let cx = margin;
      cols.forEach((col) => {
        doc.text(col.label, cx + 2, tY + 4.8);
        cx += col.w;
      });
      let rowY = tY + 7;
      selectedRows.forEach((item) => {
        const isPresent = (item.status || "").toLowerCase() === "present";
        const isLate = (item.status || "").toLowerCase() === "late";
        const isAbsent = (item.status || "").toLowerCase() === "absent";
        const rowH = 10;
        if (isPresent) {
          doc.setFillColor(247, 254, 251);
          doc.rect(margin, rowY, colW, rowH, "F");
        }
        const vals = [
          s(item.employee_id),
          s(item.name),
          s(item.department),
          s(item.position),
          s(fmtTime(item.checkInRaw ?? item.check_in)),
          s(fmtTime(item.checkOutRaw ?? item.check_out)),
          fmtHours(item.hours),
          s(
            item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "-",
          ),
        ];
        cx = margin;
        vals.forEach((val, ci) => {
          doc.setFontSize(ci === 1 ? 7.5 : 7);
          doc.setFont("helvetica", ci === 1 ? "bold" : "normal");
          if (ci === 7) {
            if (isPresent) doc.setTextColor(34, 140, 80);
            else if (isLate) doc.setTextColor(202, 138, 4);
            else if (isAbsent) doc.setTextColor(220, 38, 38);
            else doc.setTextColor(100, 110, 130);
          } else {
            doc.setTextColor(30, 35, 50);
          }
          doc.text(val, cx + 2, rowY + 6.5);
          cx += cols[ci].w;
        });
        doc.setDrawColor(235, 238, 245);
        doc.setLineWidth(0.2);
        doc.line(margin, rowY + rowH, margin + colW, rowY + rowH);
        rowY += rowH;
      });
      const footY = 282;
      doc.setDrawColor(200, 205, 215);
      doc.line(margin, footY, pageW - margin, footY);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 140, 160);
      doc.text(
        "Generated by Yerinde  " + dayjs().format("DD.MM.YYYY HH:mm"),
        margin,
        footY + 4,
      );
      doc.text("CONFIDENTIAL - For internal use only", pageW / 2, footY + 4, {
        align: "center",
      });
      doc.text("Page 1 of 1", pageW - margin, footY + 4, { align: "right" });
      doc.save("attendance_report_" + displayDate + ".pdf");
    };
    if (window.jspdf) runExport();
    else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = runExport;
      document.head.appendChild(script);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: { borderRadius: "18px", overflow: "hidden", width: 860 },
      }}
    >
      <Box sx={{ bgcolor: "#0d2540", px: 3, pt: 3, pb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 20 }}>
              Export Attendance Records
            </Typography>
            <Typography sx={{ color: "#FFFFFF", fontSize: 13, mt: 0.3 }}>
              All Employees · Daily Check-in / Check-out Data
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} mt={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <PeopleOutlineIcon sx={{ color: "#FFFFFF", fontSize: 15 }} />
                <Typography sx={{ color: "#FFFFFF", fontSize: 13 }}>
                  {rows.length} Employees
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarTodayIcon sx={{ color: "#FFFFFF", fontSize: 13 }} />
                <Typography sx={{ color: "#FFFFFF", fontSize: 13 }}>
                  {displayDate}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#3f3f3f",
              borderRadius: "8px",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)", color: '#fff' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: "#f8fafc" }}>
        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            borderBottom: "1px solid #e5e9f0",
            bgcolor: "#F8FAFC"
          }}
        >
          {[
            { label: "TOTAL EMP", value: rows.length },
            { label: "PRESENT", value: stats.present, color: "#22c55e" },
            { label: "LATE", value: stats.late, color: "#f59e0b" },
            { label: "ABSENT", value: stats.absent, color: "#ef4444" },
            { label: "TOTAL HOURS", value: stats.totalH.toFixed(2) + "h" },
            { label: "AVG HOURS", value: stats.avgH.toFixed(2) + "h" },
          ].map((st, i) => (
            <Box
              key={i}
              sx={{
                py: 2,
                px: 1,
                textAlign: "center",
                borderRight: i < 5 ? "1px solid #e5e9f0" : "none",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: st.color || "#0d2540",
                  fontFamily: "monospace",
                }}
              >
                {st.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: 9,
                  color: "#94a3b8",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {st.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Select all */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 2,
            py: 0.8,
            borderBottom: "1px solid #f0f3f8",
            bgcolor: "#fafbfd",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#64748b", mr: 1 }}>
            {selected.size} of {rows.length} selected
          </Typography>
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={selected.size > 0 && !allSelected}
            onChange={toggleAll}
            sx={{
              p: 0.3,
              color: "#0d2540",
              "&.Mui-checked": { color: "#0d2540" },
              "&.MuiCheckbox-indeterminate": { color: "#0d2540" },
            }}
          />
          <Typography sx={{ fontSize: 12, color: "#64748b", ml: 0.5 }}>
            Select All
          </Typography>
        </Box>

        {/* Table header - GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: GRID,
            px: 2,
            py: 1,
            // bgcolor: "#f8fafc",
            borderBottom: "1px solid #e5e9f0",
            bgcolor: "#F4F7FA"
          }}
        >
          <Box />
          {[
            "ID",
            "EMPLOYEE",
            "DEPARTMENT",
            "POSITION",
            "CHECK IN",
            "CHECK OUT",
            "HOURS",
            "STATUS",
          ].map((h) => (
            <Typography
              key={h}
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: 0.4,
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows - same GRID */}
        <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
          {rows.map((item) => {
            const sc = statusColor(item.status);
            const isChecked = selected.has(item.attendance_id);
            const name =
              item.name ||
              `${item.user?.first_name ?? ""} ${item.user?.last_name ?? ""}`.trim();
            const dept = item.department || item.department?.name || "-";
            const pos = item.position || item.job?.title || "-";
            const ci = fmtTime(item.checkInRaw ?? item.check_in);
            const co = fmtTime(item.checkOutRaw ?? item.check_out);
            const hrs = fmtHours(item.hours) || '-';
            const stat = item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "-";

            return (
              <Box
                key={item.attendance_id}
                onClick={() => toggle(item.attendance_id)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: GRID,
                  px: 2,
                  py: 1,
                  alignItems: "center",
                  borderBottom: "1px solid #f0f3f8",
                  cursor: "pointer",
                  bgcolor: isChecked ? "#f0f4ff" : "transparent",
                  "&:hover": { bgcolor: isChecked ? "#e8eeff" : "#fafbfd" },
                  transition: "background 0.15s",
                }}
              >
                {/* checkbox */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    onChange={() => toggle(item.attendance_id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      p: 0.2,
                      color: "#0d2540",
                      "&.Mui-checked": { color: "#0d2540" },
                    }}
                  />
                </Box>
                {/* ID */}
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748b",
                    fontFamily: "monospace",
                  }}
                >
                  {fmt(item.employee_id)}
                </Typography>
                {/* Employee */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ minWidth: 0 }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: avatarColor(item.employee_id),
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(name)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#0d2540",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {name}
                  </Typography>
                </Stack>
                {/* Department */}
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#475569",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {dept}
                </Typography>
                {/* Position */}
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#475569",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pos}
                </Typography>
                {/* Check In */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: "monospace",
                    color: "#0d2540",
                  }}
                >
                  {ci}
                </Typography>
                {/* Check Out */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: "monospace",
                    color: "#0d2540",
                  }}
                >
                  {co}
                </Typography>
                {/* Hours */}
                <Typography
                  sx={{ fontWeight: 600, fontSize: 13, color: "#0d2540" }}
                >
                  {hrs}
                </Typography>
                {/* Status */}
                <Box>
                  <Chip
                    label={stat}
                    size="small"
                    sx={{
                      height: 24,
                      borderRadius: "20px",
                      fontSize: 11,
                      fontWeight: 600,
                      bgcolor: sc.bg,
                      color: sc.color,
                      border: "none",
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Footer buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            py: 2.5,
            borderTop: "1px solid #e5e9f0",
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: "#e2e8f0",
              color: "#475569",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selected.size === 0}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              bgcolor: "#0d2540",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { bgcolor: "#1e3a5f" },
              "&.Mui-disabled": { bgcolor: "#94a3b8" },
            }}
          >
            Export {selected.size} Records
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
