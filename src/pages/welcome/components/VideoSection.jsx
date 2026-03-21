import { useState } from 'react';
import {
  Box, Typography, Grid, Paper, List,
  ListItemButton, ListItemText, ListItemAvatar, Avatar
} from "@mui/material";

export const VideoSection = () => {
  const videoList = [
    {
      id: 1,
      title: "Programmany ýüklemek we hasap açmak",
      desc: "App Store / Google Play-den ýüklemeler, e-mail bilen hasabyňyzy açyň.",
      time: "0:00",
      url: "video1.mp4"
    },
    {
      id: 2,
      title: "Dashboard we baş ekran",
      desc: "Iş tertibi, statistika we çalt işler nirededigini öwreniň.",
      time: "0:48",
      url: "video2.mp4"
    },
    {
      id: 3,
      title: "HR dolandyryşy we işgärler",
      desc: "Işgär goşmak, gatnaşyk bellemek we hasabat almak.",
      time: "1:30",
      url: "video3.mp4"
    },
    {
      id: 4,
      title: "Bildirişler we sazlamalar",
      desc: "Push bildirişlerini açmak we şahsy sazlamalaryňyzy bellemek.",
      time: "2:40",
      url: "video4.mp4"
    },
  ];

  const [activeVideo, setActiveVideo] = useState(videoList[0]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

      <Box mx={11}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '18px',
            overflow: 'hidden',
            width: '575px',
            height: '345px',
            position: 'relative',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <video
            key={activeVideo.url}
            controls
            autoPlay
            style={{ width: '100%', display: 'block', height: '100%', objectFit: 'cover' }}
          >
            <source src={activeVideo.url} type="video/mp4" />
          </video>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1, flex: 1 }}>
        <List sx={{ width: '530px', height: '323px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {videoList.map((video, index) => {
            const isActive = activeVideo.id === video.id;
            return (
              <ListItemButton
                key={video.id || index}
                onClick={() => setActiveVideo(video)}
                sx={{
                  borderRadius: '12px',
                  border: '1px solid',
                  height: '72px',
                  borderColor: isActive ? '#2557A7' : '#f0f0f0',
                  backgroundColor: isActive ? '#E8F0FB' : 'transparent',
                  '&:hover': { backgroundColor: '#f5f7f9' },
                  p: 2,
                  transition: '0.3s'
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: '#1B2E4B',
                      width: 32,
                      height: 32,
                      fontSize: '14px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      color: '#fff'
                    }}
                  >
                    {video.id}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={600} fontSize={14} color="#1B2E4B">
                        {video.title}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" color="#2557A7">
                        {video.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography color="#6B7280" fontSize={12} >
                      {video.desc}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box >
  );
};