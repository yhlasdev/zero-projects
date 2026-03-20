import Box from '@mui/material/Box';
import { LineChart, lineElementClasses, areaElementClasses } from '@mui/x-charts/LineChart';

const alphabetStock = [
    { "date": "2024-10-20", "low": 100, "high": 110 },
    { "date": "2024-10-21", "low": 110, "high": 120 },
    { "date": "2024-10-22", "low": 280, "high": 150 },
    { "date": "2024-10-23", "low": 120, "high": 170 },
    { "date": "2024-10-24", "low": 100, "high": 85 },
    { "date": "2024-10-25", "low": 240, "high": 250 },
    { "date": "2024-10-26", "low": 200, "high": 270 },
    { "date": "2024-10-27", "low": 140, "high": 210 },
    { "date": "2024-10-28", "low": 160, "high": 110 },
    { "date": "2024-10-29", "low": 140, "high": 180 },
    { "date": "2024-10-30", "low": 130, "high": 190 },
    { "date": "2024-10-31", "low": 120, "high": 200 },
    { "date": "2024-11-01", "low": 110, "high": 210 },
    { "date": "2024-11-02", "low": 100, "high": 220 },
    { "date": "2024-11-03", "low": 90, "high": 230 },
    { "date": "2024-11-04", "low": 80, "high": 240 },
    { "date": "2024-11-05", "low": 150, "high": 250 },
    { "date": "2024-11-06", "low": 200, "high": 260 },
    { "date": "2024-11-07", "low": 250, "high": 270 },
    { "date": "2024-11-10", "low": 200, "high": 280 },
    { "date": "2024-11-12", "low": 150, "high": 290 },
    { "date": "2024-11-15", "low": 100, "high": 300 },
    { "date": "2024-11-20", "low": 50, "high": 310 },
    { "date": "2024-11-22", "low": 20, "high": 320 },
];

export default function AreaChartSection() {
    return (
        <Box sx={{ width: '100%', height: 400 }}>
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
                        data: alphabetStock.map((day) => day.high),
                        label: 'Şu aý',
                        color: '#1976d2',
                        area: true,
                        showMark: false,
                        curve: 'monotoneX',
                    },
                    {
                        id: 'last-month',
                        data: alphabetStock.map((day) => day.low),
                        label: 'Geçen aý',
                        color: '#EF444499',
                        area: true,
                        showMark: false,
                        curve: 'monotoneX',
                    },
                ]}
                xAxis={[
                    {
                        id: 'date',
                        data: alphabetStock.map((day) => new Date(day.date)),
                        scaleType: 'point',
                        valueFormatter: (value) => {
                            const months = ['ýan.', 'few.', 'mart', 'apr.', 'maý', 'iyun', 'iyul', 'awg.', 'sent.', 'okt.', 'noy.', 'dek.'];
                            return `${value.getDate()} ${months[value.getMonth()]}`;
                        },
                    },
                ]}
                yAxis={[{ id: 'price', scaleType: 'linear', min: 0, max: 340 }]}
                margin={{ right: 0, top: 40, bottom: 60 }}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        strokeWidth: 4,
                    },
                    [`& .${areaElementClasses.root}.current-month`]: {
                        fill: "url(#gradient-blue) !important",
                        fillOpacity: "1 !important"
                    },
                    [`& .${areaElementClasses.root}.last-month`]: {
                        fill: "url(#gradient-red) !important",
                        fillOpacity: "1 !important"
                    },
                }}
            />
        </Box>
    );
}
