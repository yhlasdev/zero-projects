import AlarmIcon from "@mui/icons-material/Alarm";
import { Box } from "@mui/material";
import { TwoSectionCard } from "./two_section_card";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

const Features = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        flexWrap: "wrap",
        mt: -4,
      }}
    >
      <TwoSectionCard
        icon={BusinessCenterIcon}
        title="HR dolandyryş"
        description="Işgärleriň ähli maglumatlaryny bir ýerde saklaň we dolandyryň. Çalt we aňsat gözleg."
      />

      <TwoSectionCard
        icon={AlarmIcon}
        title="Iş tertibi we gatnaşyk"
        description="Işgärleriň iş tertibini we gatnaşygyny
yzarlaň. Awtomatiki hasabat ulgamy
bilen wagtyň dolandyryşy."
      />

      <TwoSectionCard
        icon={AssessmentOutlinedIcon}
        title="Hasabatlar"
        description="Jikme-jik hasabatlar we statistika.
Kararlary maglumat esasynda kabul
ediň."
      />
    </Box>
  );
};

export default Features;
