import Grid from "@mui/material/Grid2";
import "./App.css";
import ControlWeather from "./components/ControlWeather";
import TableWeather from "./components/TableWeather";

import IndicatorWeather from "./components/IndicatorWeather";
import LineChartWeather from "./components/LineChartWeather";
import { useEffect, useState } from 'react';
import Item from './interface/Item'
import TestChart from "./components/TestChart";
import Header_Weather from "./components/HeaderWeather"
interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}


function App() {


  
     {/* Variable de estado y función de actualización */}
      let[item, setItems] = useState<Item[]>([]);
     let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));



     let [indicators, setIndicators] = useState<Indicator[]>([]);

     let [value, setvalue] = useState("Guayaquil");


     const [loading, setLoading] = useState(false); // Estado de carga


    const fetchWeatherData = async (selectedCity: string) =>{
        setLoading(true);


        try{
          const API_KEY = "27a2bc97a7f2f553eb69e2ad906a8f2f";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${API_KEY}`
          );
          const xmlData = await response.text();
          // Parsear el XML
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlData, "application/xml");

          const timeElement = xml.getElementsByTagName("time")[0]; // Primer intervalo de tiempo
          const temperature = timeElement
            ?.getElementsByTagName("temperature")[0]
            ?.getAttribute("value") || "N/A";
          const wind = timeElement
            ?.getElementsByTagName("windSpeed")[0]
            ?.getAttribute("mps") || "N/A";
          const humidity = timeElement
            ?.getElementsByTagName("humidity")[0]
            ?.getAttribute("value") || "N/A";

          // Actualizar indicadores
          const dataToIndicators: Indicator[] = [
            { title: "Location", subtitle: "City", value: selectedCity },
            { title: "Temperature", subtitle: "Kelvin", value: temperature },
            { title: "Wind", subtitle: "m/s", value: wind },
            { title: "Humidity", subtitle: "%", value: humidity },
          ];
          setIndicators(dataToIndicators);

          /* indexamos el time */
          let forecast: Item[] = [];
          let list_forecast = Array.from(xml.getElementsByTagName("time"))
          
          forecast = list_forecast.slice(0,5).map((timeStamp) =>{
            return {
              dateStart: timeStamp.getAttribute("from")?.split("T")[1]|| "",
              dateEnd: timeStamp.getAttribute("to")?.split("T")[1]||"",
              precipitation: timeStamp.getElementsByTagName("precipitation")[0]?.getAttribute("probability")||" ",
              humidity: timeStamp.getElementsByTagName("humidity")[0]?.getAttribute("value")||" ",
              cloud:timeStamp.getElementsByTagName("clouds")[0]?.getAttribute("value")||" "

        }});
        setItems(forecast)
          
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };          
        


    useEffect(() =>{
        fetchWeatherData(value)
    },[value]);



  let renderIndicators = () => {

    return indicators
            .map(
                (indicator, idx) => (
                    <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                        <IndicatorWeather 
                            title={indicator["title"]} 
                            subtitle={indicator["subtitle"]} 
                            value={indicator["value"]} />
                    </Grid>
                )
            )
     
}
  return (
    <Grid container spacing={5}>
      {/* Primer encabezado  */}
      <Grid size={{xs:6, xl:12}}>
            <Header_Weather target={value} />
      </Grid>
          {renderIndicators()}
      {/* Tabla */}
      
      <Grid size={{ xs: 12, xl: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather target={value} setTarget={setvalue}/>

          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={item}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>

      <Grid size={{xs:12, xl:12}}>
          <TestChart/>
      </Grid>
    </Grid>
  );
}

export default App;