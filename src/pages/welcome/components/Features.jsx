import { Box } from "@mui/material";
import { TwoSectionCard } from "./two_section_card";
import { BriefcaseIcon, ChartIcon, GaugeIcon } from "../../../utils/Icon";

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
        icon={BriefcaseIcon}
        title="HR dolandyryş"
        description="Işgärleriň ähli maglumatlaryny bir ýerde saklaň we dolandyryň. Çalt we aňsat gözleg."
      />

      <TwoSectionCard
        icon={GaugeIcon}
        title="Iş tertibi we gatnaşyk"
        description="Işgärleriň iş tertibini we gatnaşygyny
yzarlaň. Awtomatiki hasabat ulgamy
bilen wagtyň dolandyryşy."
      />

      <TwoSectionCard
        icon={ChartIcon}
        title="Hasabatlar"
        description="Jikme-jik hasabatlar we statistika.
Kararlary maglumat esasynda kabul
ediň."
      />
    </Box>
  );
};

export default Features;
