import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export const Banner = () => {
    return (
        <Box sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Swiper
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 2000 }}
                loop
            >
                {[1, 2, 3].map((item) => (
                    <SwiperSlide key={item}>
                        <Box
                            sx={{
                                height: 400,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `linear-gradient(135deg,#1976d2,#9c27b0)`,
                                color: "white",
                            }}
                        >
                            <Typography variant="h5" fontWeight={600}>
                                Banner Slide {item}
                            </Typography>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};