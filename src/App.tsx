import Grid from "@mui/material/Grid2";
import "./App.css";
import ControlWeather from "./components/ControlWeather";
import TableWeather from "./components/TableWeather";

import IndicatorWeather from "./components/IndicatorWeather";
import LineChartWeather from "./components/LineChartWeather";
import { useEffect, useState } from 'react';
import Item from './interface/Item'

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}


function App() {


  
     {/* Variable de estado y función de actualización */}
     let [indicators, setIndicators] = useState<Indicator[]>([])
      let[item, setItems] = useState<Item[]>([])
     let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))


    {/* Hook: useEffect */}
    useEffect(()=>{

      let request = async () => {

              
              {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */}
              let savedTextXML = localStorage.getItem("openWeatherMap") || "";
              let expiringTime = localStorage.getItem("expiringTime");
 

            {/* Obtenga la estampa de tiempo actual */}
             let nowTime = (new Date()).getTime();

              if(expiringTime ==null || nowTime > parseInt(expiringTime)){
                {/* Request */}

                let API_KEY = "27a2bc97a7f2f553eb69e2ad906a8f2f"
                let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
                let savedTextXML = await response.text();
     
           
           
                    {/* Tiempo de expiración */}
                    let hours = 0.01
                    let delay = hours * 3600000
                    let expiringTime = nowTime + delay
                    {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */}
                 localStorage.setItem("openWeatherMap", savedTextXML)
                 localStorage.setItem("expiringTime", expiringTime.toString())
                 localStorage.setItem("nowTime", nowTime.toString())

                 {/* DateTime */}
                 localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
                 localStorage.setItem("nowDateTime", new Date(nowTime).toString())

                 {/* Modificación de la variable de estado mediante la función de actualización */ }
                 setOWM( savedTextXML )
              }
              if(savedTextXML){

                     {/* XML Parser */}
               const parser = new DOMParser();
               const xml = parser.parseFromString(savedTextXML, "application/xml");
               console.log(savedTextXML);

              {/* Arreglo para agregar los resultados */}

             let dataToIndicators : Indicator[] = new Array<Indicator>();

                        {/* 
                 Análisis, extracción y almacenamiento del contenido del XML 
                 en el arreglo de resultados
             */}

            
             let name = xml.getElementsByTagName("name")[0].innerHTML || ""
             dataToIndicators.push({"title":"Location", "subtitle": "City", "value": name})

             let location = xml.getElementsByTagName("location")[1]

             let latitude = location.getAttribute("latitude") || ""
             dataToIndicators.push({ "title": "Latitute", "subtitle": "Latitude", "value": latitude })

             let longitude = location.getAttribute("longitude") || ""
             dataToIndicators.push({ "title": "Longitude", "subtitle": "Longitude", "value": longitude })

             let altitude = location.getAttribute("altitude") || ""
             dataToIndicators.push({ "title": "Altitue", "subtitle": "Altitude", "value": altitude })

     {/* Modificación de la variable de estado mediante la función de actualización */}
             setIndicators( dataToIndicators )             
             /*console.log( dataToIndicators )*/
            let xmlTime  = xml.getElementsByTagName("time");
            let dataToItem:Item[] = [];
            for(let i= 0; i<6; i++){
              let xmlElement = xmlTime[i];
              let to = xmlElement.getAttribute("to") ||""
              let from_d = xmlElement.getAttribute("from") || " "
              let precipitation = xmlElement.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || ""
              let humidity = xmlElement.getElementsByTagName("humidity")[0]?.getAttribute("value") || ""
              let clouds = xmlElement.getElementsByTagName("clouds")[0]?.getAttribute("all") || ""
              console.log(`From: ${from_d}, To: ${to}, Precipitation: ${precipitation}, Humidity: ${humidity}, Clouds: ${clouds}`);

              const elemento: Item = {
                  dateStart: from_d.split("T")[1],
                  dateEnd: to.split("T")[1],
                  precipitation: precipitation,
                  humidity: humidity,
                  cloud: clouds,
                };
              dataToItem.push(elemento);
      }
      setItems(dataToItem);
      }
       }

      request();

  },[owm])

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
  
          {/* Indicadores 

          <Grid size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={"Indicator 1"}
              subtitle={"Unidad 1"}
              value={"1.23"}
            />
          </Grid>
          <Grid size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={"Indicator 2"}
              subtitle={"Unidad 2"}
              value={"3.12"}
            />
          </Grid>
          <Grid size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={"Indicator 3"}
              subtitle={"Unidad 3"}
              value={"2.31"}
            />
          </Grid>
          <Grid size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={"Indicator 4"}
              subtitle={"Unidad 4"}
              value={"3.21"}
            />
          </Grid>
          */}

          {renderIndicators()}
   

      {/* Tabla */}
      <Grid size={{ xs: 12, xl: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather/>

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
    </Grid>
  );
}

export default App;
