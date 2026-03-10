/* 

export const AttendanceStatisticLine = ({ item }) => {
    return (
        <Box
            key={item.label}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: item.color,
                    }}
                />
                <Typography variant="body1" fontWeight={500} >
                    {item.label}
                </Typography>
            </Box>
            <Typography variant="body1" fontWeight={600} >
                {item.value}%
            </Typography>
        </Box>
    )
} */