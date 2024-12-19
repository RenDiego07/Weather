import Grid from "@mui/material/Grid2";
import "./App.css";
import ControlWeather from "./components/ControlWeather";
import TableWeather from "./components/TableWeather";
import ControLocation from "./components/ControLocation"
import IndicatorWeather from "./components/IndicatorWeather";
import LineChartWeather from "./components/LineChartWeather";
import { useEffect, useState } from 'react';
import Item from './interface/Item'
import Header_Weather from "./components/HeaderWeather"
import LocationMap from "./components/LocationMap";
import Coordinates from "./interface/Coordinates";


interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}


function App() {

    {/*Coordenadas para Quito, Guayaquil, Salinas*/}
    const hashCities: {[key:string]: Coordinates}  = {
        "Guayaquil": {
          center:[-2.170998, -79.922359], 
          zoom: 12
        }, 
        "Quito": {
          center: [-0.180653, -78.467834],
          zoom: 12
        },
        "Salinas":{
          center: [-2.204514,-80.979979],
          zoom:12
        }
    };



    // variables para el gráfico
    let [meteorology, setMeteorology] = useState({ciudad: "Guayaquil", meteorologia: "Temperatura"})
    //



     {/* Variable de estado y función de actualización */}
    let[item, setItems] = useState<Item[]>([]);
    let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));

    let [cords, setCords ] = useState({  center:[-2.170998, -79.922359], 
      zoom: 12})


    let [indicators, setIndicators] = useState<Indicator[]>([]);

    let [value, setvalue] = useState("Guayaquil");
    let [weather, setWeather] = useState("Temperature")


     const [loading, setLoading] = useState(false); // Estado de carga

     const mapCity = (selectedCity: string): void =>{
        if(hashCities[selectedCity]){
          setCords({
            center: hashCities[selectedCity].center,
            zoom: hashCities[selectedCity].zoom
          })
        }
     }

    const fetchWeatherData = async (selectedCity: string) =>{

        setLoading(true);
        try{
          const API_KEY = "27a2bc97a7f2f553eb69e2ad906a8f2f";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${API_KEY}`
          );

          const xmlData = await response.text();

          console.log(xmlData)

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
        console.log(value)
        mapCity(value)
        
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
    <div className="background">
    <Grid container spacing={5}>
      {/* Primer encabezado  */}
      <Grid size={{xs:6, xl:12}}>
            <Header_Weather target={value} />
      </Grid>
          {renderIndicators()}
      {/* Tabla */}
      
      <Grid size={{ xs: 12, xl: 6 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, xl: 3 }} container spacing ={5} >
          <ControLocation target={value} setTarget={setvalue}/>  
          <ControlWeather target={weather}  setTarget={setWeather}/>
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={item}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 6 }} className="de">
      <LocationMap center={cords.center} zoom={cords.zoom} ></LocationMap>
      </Grid>

      <Grid size ={{xs:12, xl:5}} >
      {/*<LineChartWeather /> */}
      </Grid>

    </Grid>
  </div>
  );
}

export default App;