import AlarmIcon from '@mui/icons-material/Alarm';
import { Box } from '@mui/material';
import { TwoSectionCard } from './two_section_card';


const Features = () => {
  return (
    <Box className="features  flex gap-5 justify-center">
      <TwoSectionCard
        icon={AlarmIcon}
        title={'HR dolandyrys'}
        description={'Işgärleriň ähli maglumatlaryny bir ýerde saklaň we dolandyryň. Çalt we aňsat gözleg.'} />
      <TwoSectionCard
        icon={AlarmIcon}
        title={'HR dolandyrys'}
        description={'Işgärleriň ähli maglumatlaryny bir ýerde saklaň we dolandyryň. Çalt we aňsat gözleg.'} />
      <TwoSectionCard
        icon={AlarmIcon}
        title={'HR dolandyrys'}
        description={'Işgärleriň ähli maglumatlaryny bir ýerde saklaň we dolandyryň. Çalt we aňsat gözleg.'} />
    </Box>
  );
};

export default Features;