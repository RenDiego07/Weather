import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import TestProp from '../interface/TestProp';
// vlaores eje y


export default function LineChartWeather({arg1, tag}: TestProp ) {

    console.log(tag)
    
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
                    { data: arg1.axis_Y},
                ]}
                xAxis={[{ scaleType: 'point', data: arg1.axis_X }]}
            />
        </Paper>
    );
}