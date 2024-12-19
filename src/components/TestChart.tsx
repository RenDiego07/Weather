import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";


const data = [
    { time: "00:00", temperature: 23 },
    { time: "06:00", temperature: 26 },
    { time: "12:00", temperature: 31 },
    { time: "18:00", temperature: 27 },
    { time: "00:00", temperature: 23 },
  ];
  

  export default function TestChart() {
    return (
      <LineChart width={400} height={200} data={data} className="testChart">
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="#FFB400" strokeWidth={2} />
        <Area type="monotone" dataKey="temperature" fill="#FFB400" fillOpacity={0.2} />
      </LineChart>
    );
  }
