import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { formatTime } from "../../../utils/formatTime";
import StatusChip from "../../../components/table/StatusChip";

export default function ExportModal({
  open,
  onClose,
  employee,
  attendance,
  dateRange,
}) {
  const records = attendance?.attendances || [];
  const avgCheckIn = formatTime(attendance?.avg_check_in);
  const avgCheckOut = formatTime(attendance?.avg_check_out);
  const totalHours = attendance?.total_hours?.toFixed?.(1) || "-";
  const presentDays = attendance?.present_days || "-";
  const totalDays = records.length || "-";
  const weekendDays = records.filter((r) => r.status === "Weekend").length;

  const startDate = dateRange?.[0]?.format("DD.MM.YYYY") || "";
  const endDate = dateRange?.[1]?.format("DD.MM.YYYY") || "";

  const handleExport = () => {
    // s() — jsPDF doc.text() only accepts string, NEVER number/null/undefined
    const s = (val) => {
      if (val === null || val === undefined) return "-";
      return String(val);
    };

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

      // ── Header bar ──────────────────────────────────────────────────────
      doc.setFillColor(13, 37, 64);
      doc.rect(0, 0, pageW, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Yerinde", margin, 9);

      doc.setFontSize(7);
      doc.text("Workforce Management", margin, 14);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Individual Attendance Report", pageW / 2, 10, {
        align: "center",
      });

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Daily Check-in / Check-out Records", pageW / 2, 16, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.setTextColor(160, 200, 255);
      doc.text("Period", pageW - margin, 7, { align: "right" });

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(startDate + " -> " + endDate, pageW - margin, 12, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        "Exported: " + dayjs().format("DD.MM.YYYY HH:mm"),
        pageW - margin,
        17,
        { align: "right" },
      );

      // ── Employee info box ────────────────────────────────────────────────
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(220, 225, 235);
      doc.roundedRect(margin, 33, colW, 20, 2, 2, "FD");

      doc.setTextColor(20, 20, 40);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(s(employee?.name), margin + 4, 41);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 110, 130);
      doc.text(
        s(employee?.position) + " · " + s(employee?.department),
        margin + 4,
        47,
      );

      doc.setFontSize(7);
      doc.setTextColor(100, 110, 130);
      doc.text("Employee ID", pageW - margin - 4, 39, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 37, 64);
      doc.text(s(employee?.employee_id), pageW - margin - 4, 46, {
        align: "right",
      });

      // ── Stats row ────────────────────────────────────────────────────────
      const statsArr = [
        { label: "TOTAL DAYS", value: s(totalDays) },
        { label: "PRESENT", value: s(presentDays), green: true },
        { label: "WEEKEND", value: s(weekendDays) },
        { label: "TOTAL HOURS", value: s(totalHours) + "h" },
        { label: "AVG CHECK-IN", value: s(avgCheckIn) },
        { label: "AVG CHECK-OUT", value: s(avgCheckOut) },
      ];

      const statW = colW / statsArr.length;
      const statY = 57;

      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, statY, margin + colW, statY);
      doc.line(margin, statY + 16, margin + colW, statY + 16);

      statsArr.forEach((stat, i) => {
        const x = margin + i * statW + statW / 2;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        if (stat.green) {
          doc.setTextColor(34, 140, 80);
        } else {
          doc.setTextColor(20, 20, 40);
        }
        doc.text(stat.value, x, statY + 8, { align: "center" });

        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 130, 150);
        doc.text(stat.label, x, statY + 13, { align: "center" });

        if (i > 0) {
          doc.setDrawColor(220, 225, 235);
          doc.line(margin + i * statW, statY, margin + i * statW, statY + 16);
        }
      });

      // ── Table header ─────────────────────────────────────────────────────
      const tY = 79;
      const cols = [
        { label: "#", w: 10 },
        { label: "Date", w: 28 },
        { label: "Day", w: 25 },
        { label: "Check In", w: 25 },
        { label: "Check Out", w: 25 },
        { label: "Hours", w: 20 },
        { label: "Status", w: 0 },
      ];
      const usedW = cols.slice(0, -1).reduce((acc, c) => acc + c.w, 0);
      cols[cols.length - 1].w = colW - usedW;

      doc.setFillColor(245, 247, 250);
      doc.rect(margin, tY, colW, 8, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 110, 130);

      let cx = margin;
      cols.forEach((col) => {
        doc.text(col.label, cx + 2, tY + 5.5);
        cx += col.w;
      });

      // ── Rows ─────────────────────────────────────────────────────────────
      let rowY = tY + 8;

      records.forEach((item, idx) => {
        const isPresent = item.status === "Present";
        const isWeekend = item.status === "Weekend";
        const rowH = 9;

        if (isPresent) {
          doc.setFillColor(240, 253, 245);
          doc.rect(margin, rowY, colW, rowH, "F");
        }

        const checkIn = formatTime(item.check_in);
        const checkOut = formatTime(item.check_out);
        const hours = item.hours ? s(item.hours.toFixed(1)) + "h" : "-";

        const rowVals = [
          s(records.length - idx),
          dayjs(item.work_date).format("DD.MM.YYYY"),
          dayjs(item.work_date).format("dddd"),
          s(checkIn),
          s(checkOut),
          hours,
          s(item.status),
        ];

        cx = margin;
        rowVals.forEach((val, ci) => {
          doc.setFontSize(8);
          doc.setFont("helvetica", ci === 0 ? "bold" : "normal");

          if (ci === 6) {
            doc.setTextColor(
              isPresent ? 34 : 120,
              isPresent ? 140 : 130,
              isPresent ? 80 : 150,
            );
          } else if (isWeekend) {
            doc.setTextColor(160, 165, 180);
          } else {
            doc.setTextColor(20, 20, 40);
          }

          doc.text(val, cx + 2, rowY + 6);
          cx += cols[ci].w;
        });

        doc.setDrawColor(230, 235, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, rowY + rowH, margin + colW, rowY + rowH);
        rowY += rowH;
      });

      // ── Summary box ──────────────────────────────────────────────────────
      const sumY = rowY + 6;
      const avgHrs =
        attendance?.total_hours && attendance?.present_days
          ? s((attendance.total_hours / attendance.present_days).toFixed(1))
          : "-";

      doc.setFillColor(240, 253, 245);
      doc.setDrawColor(34, 160, 90);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, sumY, colW, 10, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 140, 80);
      doc.text("Summary", margin + 4, sumY + 6.5);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 80, 60);
      doc.text(
        "  " +
          s(presentDays) +
          " present days of " +
          s(totalDays) +
          " total  |  " +
          s(totalHours) +
          "h total  |  Avg " +
          avgHrs +
          "h/day",
        margin + 22,
        sumY + 6.5,
      );

      // ── Footer ───────────────────────────────────────────────────────────
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

      doc.save(
        "attendance_" +
          s(employee?.employee_id) +
          "_" +
          startDate +
          "_" +
          endDate +
          ".pdf",
      );
    };

    if (window.jspdf) {
      runExport();
    } else {
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
      width={"760px"}
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden", maxWidth: 680 },
      }}
    >
      {/* Dark header */}
      <Box sx={{ bgcolor: "#0F3254", px: 3, pt: 3, pb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 20 }}
            >
              {employee?.name}
            </Typography>
            <Typography sx={{ color: "#FFFFFF", fontSize: 13, mt: 0.3 }}>
              {employee?.position}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.8}>
              <CalendarTodayIcon sx={{ color: "#FFFFFF", fontSize: 13 }} />
              <Typography sx={{ color: "#FFFFFF", fontSize: 13 }}>
                {startDate} - {endDate}
              </Typography>
            </Stack>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: "#FFFFFF",
              color: "#494848",
              borderRadius: "8px",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)",color: '#e5e5e5' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: "#f8fafc" }}>
        {/* Stats row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            borderBottom: "1px solid #e5e9f0",
          }}
        >
          {[
            { label: "TOTAL DAYS", value: totalDays },
            { label: "PRESENT", value: presentDays, green: true },
            { label: "WEEKEND", value: weekendDays },
            { label: "TOTAL HOURS", value: totalHours + "h" },
            { label: "AVG CHECK-IN", value: avgCheckIn || "—" },
            { label: "AVG CHECK-OUT", value: avgCheckOut || "—" },
          ].map((stat, i) => (
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
                  color: stat.green ? "#22c55e" : "#0d2540",
                  fontFamily: "monospace",
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: 9,
                  color: "#94a3b8",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "200px 100px 100px 100px auto",
            px: 3,
            py: 1,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e5e9f0",
          }}
        >
          {["DATE", "CHECK IN", "CHECK OUT", "HOURS", "STATUS", ""].map(
            (h, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </Typography>
            ),
          )}
        </Box>

        {/* Records */}
        <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
          {records.map((item) => {
            // const isPresent = item.status === "Present";
            const isWeekend = item.status === "Weekend";
            const dayNum = dayjs(item.work_date).format("DD");

            return (
              <Box
                key={item.attendance_id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "200px 100px 100px 100px auto",
                  px: 3,
                  py: 1.5,
                  alignItems: "center",
                  borderBottom: "1px solid #f0f3f8",
                  "&:hover": { bgcolor: "#fafbfd" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "10px",
                      bgcolor: "#0F3254",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 13 }}
                    >
                      {dayNum}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: isWeekend ? "#94a3b8" : "#0d2540",
                      }}
                    >
                      {dayjs(item.work_date).format("DD.MM.YYYY")}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      {dayjs(item.work_date).format("ddd")}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: isWeekend ? "#94a3b8" : "#0d2540",
                    fontFamily: "monospace",
                  }}
                >
                  {formatTime(item.check_in) || "—"}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: isWeekend ? "#94a3b8" : "#0d2540",
                    fontFamily: "monospace",
                  }}
                >
                  {formatTime(item.check_out) || "—"}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: isWeekend ? "#94a3b8" : "#0d2540",
                    fontFamily: "monospace",
                  }}
                >
                  {item.hours ? item.hours.toFixed(1) + "h" : "-"}
                </Typography>

                {/* <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    width: 80,
                    height: 26,
                    borderRadius: "20px",
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: isPresent ? "#dcfce7" : "#f1f5f9",
                    color: isPresent ? "#16a34a" : "#64748b",
                    border: "none",
                    textTransform: "capitalize",
                  }}
                /> */}
                <StatusChip status={item.status} />
                <Box />
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
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              bgcolor: "#0d2540",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { bgcolor: "#0F3254" },
            }}
          >
            Export Records
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
