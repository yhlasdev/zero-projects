import {
  Box,
  Typography,
  Stack,
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

    // Always English day names regardless of locale
    const DAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Colors — exact from screenshots
    const C = {
      navy: [13, 37, 64], // #0d2540 dark navy
      white: [255, 255, 255],
      lightBlue: [147, 190, 240], // Period / Exported labels in header
      teal: [94, 210, 190], // subtitle + Weekend stat value
      green: [22, 163, 74], // Present text / Summary
      greenBg: [240, 253, 244], // Present status cell bg
      gray: [100, 116, 139], // muted text
      grayLight: [148, 163, 184], // table header labels / weekend text
      border: [220, 225, 235],
      rowBorder: [230, 235, 242],
      statBg: [255, 255, 255],
      empBoxBg: [248, 250, 252],
      tableHeadBg: [245, 247, 250],
    };

    const runExport = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = 210;
      const M = 14; // margin
      const colW = pageW - M * 2;

      // ════════════════════════════════════════════════════════════
      // IMAGE 1 — HEADER
      // ════════════════════════════════════════════════════════════
      const headerH = 36;
      doc.setFillColor(...[13, 37, 64]);
      doc.rect(0, 0, pageW, headerH, "F");

      // LEFT — "Yerinde" very large bold white
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...C.white);
      doc.text("Yerinde", M, 15);

      // LEFT — "Workforce Management" normal light-blue below
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...C.lightBlue);
      doc.text("Workforce Management", M, 23);

      // CENTER — "Individual Attendance Report" bold white
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...C.white);
      doc.text("Individual Attendance Report", pageW / 2, 14, {
        align: "center",
      });

      // CENTER — "Daily Check-in / Check-out Records" teal normal
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...C.teal);
      doc.text("Daily Check-in / Check-out Records", pageW / 2, 22, {
        align: "center",
      });

      // RIGHT TOP — "Period" small light-blue
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.lightBlue);
      doc.text("Period", pageW - M, 10, { align: "right" });

      // RIGHT — "DD.MM.YYYY → DD.MM.YYYY" bold white larger
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.white);
      doc.text(startDate + "  ⟶  " + endDate, pageW - M, 17, {
        align: "right",
      });

      // RIGHT — "Exported: ..." light-blue small
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.lightBlue);
      doc.text(
        "Exported: " + dayjs().format("DD.MM.YYYY HH:mm"),
        pageW - M,
        25,
        { align: "right" },
      );

      // ════════════════════════════════════════════════════════════
      // IMAGE 2 — EMPLOYEE BOX
      // ════════════════════════════════════════════════════════════
      const empY = headerH + 5;
      const empH = 22;
      doc.setFillColor(...C.empBoxBg);
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.4);
      doc.roundedRect(M, empY, colW, empH, 2, 2, "FD");

      // Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...C.navy);
      doc.text(s(employee?.name), M + 5, empY + 9);

      // Position · Department
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.gray);
      doc.text(
        s(employee?.position) + " - " + s(employee?.department),
        M + 5,
        empY + 16,
      );

      // Employee ID label (right top of box)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.gray);
      doc.text("Employee ID", pageW - M - 5, empY + 8, { align: "right" });

      // Employee ID value bold navy
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...C.navy);
      doc.text(s(employee?.employee_id), pageW - M - 5, empY + 16, {
        align: "right",
      });

      // ════════════════════════════════════════════════════════════
      // IMAGE 2 — STATS ROW (6 columns)
      // NOTE: WEEKEND value is teal, PRESENT is green, rest navy
      // ════════════════════════════════════════════════════════════
      const statsArr = [
        { label: "TOTAL DAYS", value: s(totalDays), color: C.navy },
        { label: "PRESENT", value: s(presentDays), color: C.green },
        { label: "WEEKEND", value: s(weekendDays), color: C.teal },
        { label: "TOTAL HOURS", value: s(totalHours) + "h", color: C.navy },
        { label: "AVG CHECK-IN", value: s(avgCheckIn) || "-", color: C.navy },
        { label: "AVG CHECK-OUT", value: s(avgCheckOut) || "-", color: C.navy },
      ];

      const statY = empY + empH + 5;
      const statH = 20;
      const statW = colW / 6;

      doc.setFillColor(...C.statBg);
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.3);
      doc.rect(M, statY, colW, statH, "FD");

      statsArr.forEach((stat, i) => {
        const x = M + i * statW + statW / 2;

        // Value — large bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...stat.color);
        doc.text(stat.value, x, statY + 9, { align: "center" });

        // Label — small caps gray bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(...C.grayLight);
        doc.text(stat.label, x, statY + 16, { align: "center" });

        // Vertical dividers between cells
        if (i > 0) {
          doc.setDrawColor(...C.border);
          doc.setLineWidth(0.3);
          doc.line(M + i * statW, statY, M + i * statW, statY + statH);
        }
      });

      // ════════════════════════════════════════════════════════════
      // IMAGE 3 — SECTION TITLE
      // ════════════════════════════════════════════════════════════
      const secTitleY = statY + statH + 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...C.navy);
      doc.text("Daily Check-in / Check-out Records", M, secTitleY);

      // ════════════════════════════════════════════════════════════
      // IMAGE 3 — TABLE
      // Column widths (total = colW = 182mm)
      //   #=12, Date=30, Day=30, CheckIn=26, CheckOut=26, Hours=22, Status=36
      // ════════════════════════════════════════════════════════════
      const cols = [
        { label: "#", w: 12 },
        { label: "Date", w: 30 },
        { label: "Day", w: 30 },
        { label: "Check In", w: 26 },
        { label: "Check Out", w: 26 },
        { label: "Hours", w: 22 },
        { label: "Status", w: 0 },
      ];
      const usedW = cols.slice(0, -1).reduce((a, c) => a + c.w, 0);
      cols[6].w = colW - usedW; // Status gets the rest

      const tY = secTitleY + 5;
      const tHeadH = 9;
      const rowH = 11; // taller rows like in screenshot

      // Table header background
      doc.setFillColor(...C.tableHeadBg);
      doc.rect(M, tY, colW, tHeadH, "F");

      // Bottom border of header
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.3);
      doc.line(M, tY + tHeadH, M + colW, tY + tHeadH);

      // Header labels
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.grayLight);
      let cx = M;
      cols.forEach((col) => {
        doc.text(col.label, cx + 3, tY + 6.2);
        cx += col.w;
      });

      // ── Rows ──────────────────────────────────────────────────
      let rowY = tY + tHeadH;

      records.forEach((item, idx) => {
        const isPresent = item.status === "Present";
        const isWeekend = item.status === "Weekend";
        const dayName = DAYS[dayjs(item.work_date).day()];
        const checkIn = formatTime(item.check_in) || "-";
        const checkOut = formatTime(item.check_out) || "-";
        const hours = item.hours ? s(item.hours.toFixed(1)) + "h" : "--";

        // White row bg (clean)
        doc.setFillColor(255, 255, 255);
        doc.rect(M, rowY, colW, rowH, "F");

        // For Present rows: light green bg on STATUS CELL ONLY
        if (isPresent) {
          const statusColStart =
            M + cols.slice(0, 6).reduce((a, c) => a + c.w, 0);
          doc.setFillColor(...C.greenBg);
          doc.rect(statusColStart, rowY, cols[6].w, rowH, "F");
        }

        // ── Cell values ────────────────────────────────────────
        // Muted color for weekend rows, navy for present/others
        const textColor = isWeekend ? C.grayLight : C.navy;

        cx = M;
        // Col 0: # — bold, larger
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        doc.text(s(records.length - idx), cx + 3, rowY + 7.2);
        cx += cols[0].w;

        // Col 1: Date — bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...textColor);
        doc.text(
          dayjs(item.work_date).format("DD.MM.YYYY"),
          cx + 3,
          rowY + 7.2,
        );
        cx += cols[1].w;

        // Col 2: Day — normal gray (always muted regardless of status)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...C.grayLight);
        doc.text(dayName, cx + 3, rowY + 7.2);
        cx += cols[2].w;

        // Col 3: Check In — bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...textColor);
        doc.text(checkIn, cx + 3, rowY + 7.2);
        cx += cols[3].w;

        // Col 4: Check Out — bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...textColor);
        doc.text(checkOut, cx + 3, rowY + 7.2);
        cx += cols[4].w;

        // Col 5: Hours — bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...textColor);
        doc.text(hours, cx + 3, rowY + 7.2);
        cx += cols[5].w;

        // Col 6: Status — NO pill, plain bold text, right-aligned in cell
        // "Present" = green bold, "Weekend" = gray bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        if (isPresent) {
          doc.setTextColor(...C.green);
          doc.text("Present", cx + cols[6].w - 4, rowY + 7.2, {
            align: "right",
          });
        } else if (isWeekend) {
          doc.setTextColor(...C.grayLight);
          doc.text("Weekend", cx + cols[6].w - 4, rowY + 7.2, {
            align: "right",
          });
        } else {
          doc.setTextColor(...C.gray);
          doc.text(s(item.status), cx + cols[6].w - 4, rowY + 7.2, {
            align: "right",
          });
        }

        // Row bottom divider
        doc.setDrawColor(...C.rowBorder);
        doc.setLineWidth(0.25);
        doc.line(M, rowY + rowH, M + colW, rowY + rowH);

        rowY += rowH;
      });

      // ════════════════════════════════════════════════════════════
      // IMAGE 4 — SUMMARY BOX
      // ════════════════════════════════════════════════════════════
      const sumY = rowY + 7;
      const avgHrs =
        attendance?.total_hours && attendance?.present_days
          ? s((attendance.total_hours / attendance.present_days).toFixed(1))
          : "-";

      doc.setFillColor(...C.greenBg);
      doc.setDrawColor(...C.green);
      doc.setLineWidth(0.5);
      doc.roundedRect(M, sumY, colW, 11, 2, 2, "FD");

      // Summary label — green bold, then separator, then normal text all in one box
      // Draw a small green filled circle as checkmark indicator
      doc.setFillColor(...C.green);
      doc.circle(M + 7, sumY + 5.5, 2.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("v", M + 7, sumY + 6.5, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...C.green);
      doc.text("Summary", M + 13, sumY + 7.5);

      // Rest of summary text — dark normal
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 70, 55);
      const sumText =
        s(presentDays) +
        " present days out of " +
        s(totalDays) +
        " total  .  " +
        s(totalHours) +
        "h total hours worked  .  Average " +
        avgHrs +
        "h per working day";
      doc.text(sumText, M + 38, sumY + 7.5);

      // ════════════════════════════════════════════════════════════
      // IMAGE 4 — FOOTER
      // ════════════════════════════════════════════════════════════
      const footY = 284;
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.3);
      doc.line(M, footY, pageW - M, footY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...C.gray);
      doc.text(
        "Generated by Yerinde  " + dayjs().format("DD.MM.YYYY HH:mm"),
        M,
        footY + 5,
      );
      doc.text("CONFIDENTIAL - For internal use only", pageW / 2, footY + 5, {
        align: "center",
      });
      doc.text("Page 1 of 1", pageW - M, footY + 5, { align: "right" });

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
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)", color: "#e5e5e5" },
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
