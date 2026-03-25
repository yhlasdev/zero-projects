import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { LineChart, lineElementClasses, areaElementClasses } from '@mui/x-charts/LineChart';

const daily_hours_last_30 = [
    { "day": "2026-02-19T00:00:00Z", "hours": 7 },
    { "day": "2026-02-20T00:00:00Z", "hours": 5 },
    { "day": "2026-02-21T00:00:00Z", "hours": 2 },
    { "day": "2026-02-22T00:00:00Z", "hours": 4 },
    { "day": "2026-02-23T00:00:00Z", "hours": 4 },
    { "day": "2026-02-24T00:00:00Z", "hours": 5 },
    { "day": "2026-02-25T00:00:00Z", "hours": 6 },
    { "day": "2026-02-26T00:00:00Z", "hours": 6 },
    { "day": "2026-02-27T00:00:00Z", "hours": 3 },
    { "day": "2026-02-28T00:00:00Z", "hours": 2 },
    { "day": "2026-03-01T00:00:00Z", "hours": 2 },
    { "day": "2026-03-02T00:00:00Z", "hours": 7 },
    { "day": "2026-03-03T00:00:00Z", "hours": 2 },
    { "day": "2026-03-04T00:00:00Z", "hours": 7 },
    { "day": "2026-03-05T00:00:00Z", "hours": 8 },
    { "day": "2026-03-06T00:00:00Z", "hours": 4 },
    { "day": "2026-03-07T00:00:00Z", "hours": 6 },
    { "day": "2026-03-08T00:00:00Z", "hours": 8 },
    { "day": "2026-03-09T00:00:00Z", "hours": 4 },
    { "day": "2026-03-10T00:00:00Z", "hours": 4 },
    { "day": "2026-03-11T00:00:00Z", "hours": 5 },
    { "day": "2026-03-12T00:00:00Z", "hours": 2 },
    { "day": "2026-03-13T00:00:00Z", "hours": 2 },
    { "day": "2026-03-14T00:00:00Z", "hours": 4 },
    { "day": "2026-03-15T00:00:00Z", "hours": 8 },
    { "day": "2026-03-16T00:00:00Z", "hours": 7 },
    { "day": "2026-03-17T00:00:00Z", "hours": 2 },
    { "day": "2026-03-18T00:00:00Z", "hours": 8 },
    { "day": "2026-03-19T00:00:00Z", "hours": 7 },
    { "day": "2026-03-20T00:00:00Z", "hours": 6 }
];

const daily_hours_30_to_60 = [
    { "day": "2026-01-19T00:00:00Z", "hours": 7 },
    { "day": "2026-01-20T00:00:00Z", "hours": 3 },
    { "day": "2026-01-21T00:00:00Z", "hours": 8 },
    { "day": "2026-01-22T00:00:00Z", "hours": 8 },
    { "day": "2026-01-23T00:00:00Z", "hours": 6 },
    { "day": "2026-01-24T00:00:00Z", "hours": 5 },
    { "day": "2026-01-25T00:00:00Z", "hours": 8 },
    { "day": "2026-01-26T00:00:00Z", "hours": 7 },
    { "day": "2026-01-27T00:00:00Z", "hours": 2 },
    { "day": "2026-01-28T00:00:00Z", "hours": 6 },
    { "day": "2026-01-29T00:00:00Z", "hours": 8 },
    { "day": "2026-01-30T00:00:00Z", "hours": 2 },
    { "day": "2026-01-31T00:00:00Z", "hours": 6 },
    { "day": "2026-02-01T00:00:00Z", "hours": 8 },
    { "day": "2026-02-02T00:00:00Z", "hours": 6 },
    { "day": "2026-02-03T00:00:00Z", "hours": 4 },
    { "day": "2026-02-04T00:00:00Z", "hours": 7 },
    { "day": "2026-02-05T00:00:00Z", "hours": 3 },
    { "day": "2026-02-06T00:00:00Z", "hours": 5 },
    { "day": "2026-02-07T00:00:00Z", "hours": 2 },
    { "day": "2026-02-08T00:00:00Z", "hours": 7 },
    { "day": "2026-02-09T00:00:00Z", "hours": 3 },
    { "day": "2026-02-10T00:00:00Z", "hours": 7 },
    { "day": "2026-02-11T00:00:00Z", "hours": 6 },
    { "day": "2026-02-12T00:00:00Z", "hours": 8 },
    { "day": "2026-02-13T00:00:00Z", "hours": 5 },
    { "day": "2026-02-14T00:00:00Z", "hours": 8 },
    { "day": "2026-02-15T00:00:00Z", "hours": 8 },
    { "day": "2026-02-16T00:00:00Z", "hours": 6 },
    { "day": "2026-02-17T00:00:00Z", "hours": 4 },
    { "day": "2026-02-18T00:00:00Z", "hours": 2 }
];

export default function AreaChartSection() {
    return (
        <Box sx={{ width: '100%', height: 400, mt: 5, pb: 3 }}>
            <svg style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }}>
                <defs>
                    <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D61E7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3B82F6CC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D93B2D" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#EF444499" stopOpacity={0} />
                    </linearGradient>
                </defs>
            </svg>
            <LineChart
                series={[
                    {
                        id: 'current-month',
                        data: daily_hours_last_30.map((d) => d.hours),
                        color: '#1D61E7',
                        area: true,
                        showMark: false,
                        curve: 'monotoneX',
                    },
                    {
                        id: 'last-month',
                        data: daily_hours_30_to_60.slice(0, 30).map((d) => d.hours),
                        color: '#EF444499',
                        area: true,
                        showMark: false,
                        curve: 'monotoneX',
                    },
                ]}
                xAxis={[
                    {
                        id: 'date',
                        data: daily_hours_last_30.map((d) => new Date(d.day)),
                        scaleType: 'point',
                        valueFormatter: (value) => {
                            const months = ['ýan.', 'few.', 'mart', 'apr.', 'maý', 'iyun', 'iyul', 'awg.', 'sent.', 'okt.', 'noy.', 'dek.'];
                            return `${value.getDate()} ${months[value.getMonth()]}`;
                        },
                    },
                ]}
                yAxis={[{ id: 'price', scaleType: 'linear', min: 0 }]}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                        markGap: 5,
                    }
                }}
                margin={{ right: 0, top: 20, bottom: 80 }}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        strokeWidth: 2,
                    },
                    [`& .${areaElementClasses.root}.current-month`]: {
                        fill: "url(#gradient-blue) !important",
                        fillOpacity: "1 !important"
                    },
                    [`& .${areaElementClasses.root}.last-month`]: {
                        fill: "url(#gradient-red) !important",
                        fillOpacity: "1 !important"
                    },
                    '& .MuiChartsLegend-mark': {
                        ry: 10,
                        rx: 10,
                    }
                }}
            />
            <Box className=' flex justify-center gap-5'>

                <Box className=' flex items-center gap-2'>
                    <Box className=' w-5 h-5 rounded-full bg-[#1D61E7]'></Box>
                    <Typography sx={{ fontSize: '12.43px', color: '#1D61E7' }}>Şu aý</Typography>
                </Box>
                <Box className=' flex items-center gap-2'>
                    <Box className=' w-5 h-5 rounded-full bg-[#D93B2D]'></Box>
                    <Typography sx={{ fontSize: '12.43px', color: '#D93B2D' }}>Geçen aý</Typography>
                </Box>
            </Box>
        </Box>
    );
}
