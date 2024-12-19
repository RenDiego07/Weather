import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import GraphInput from '../interface/GraphInput'

// vlaores eje y
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

// eje x 
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

export default function LineChartWeather(prop: GraphInput, tag: string) {

    
    
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            {/* Componente para un gráfico de líneas */}
            <LineChart
                width={400}
                height={250}
                series={[
                    { data: prop.axis_Y, label: tag },
                ]}
                xAxis={[{ scaleType: 'point', data: prop.axis_X }]}
            />
        </Paper>
    );
}