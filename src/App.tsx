import Grid from "@mui/material/Grid2";
import "./App.css";
import ControlWeather from "./components/ControlWeather";
import TableWeather from "./components/TableWeather";
import ControLocation from "./components/ControLocation";
import IndicatorWeather from "./components/IndicatorWeather";
import LineChartWeather from "./components/LineChartWeather";
import { useEffect, useState } from "react";
import Item from "./interface/Item";
import Header_Weather from "./components/HeaderWeather";
import LocationMap from "./components/LocationMap";
import Coordinates from "./interface/Coordinates";
import GraphInput from "./interface/GraphInput";

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

function App() {
  {
    /*Coordenadas para Quito, Guayaquil, Salinas*/
  }
  const hashCities: { [key: string]: Coordinates } = {
    Guayaquil: {
      center: [-2.170998, -79.922359],
      zoom: 12,
    },
    Quito: {
      center: [-0.180653, -78.467834],
      zoom: 12,
    },
    Salinas: {
      center: [-2.204514, -80.979979],
      zoom: 12,
    },
  };

  // variables para el gráfico
  //
  const [graphValues, setGraphValue] = useState<GraphInput | undefined>(undefined);


  {
    /* Variable de estado y función de actualización */
  }
  const [item, setItems] = useState<Item[]>([]);

  const [cords, setCords] = useState<Coordinates>({
    center: [-2.170998, -79.922359], // Latitud y longitud
    zoom: 12, // Nivel de zoom
  });
  

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [value, setvalue] = useState("Guayaquil");

  const [weather, setWeather] = useState("Temperatura");

  // Llenar gráfico
  const filter_data = (meteorology: string, data: Document): GraphInput => {
    let dictionary: Map<string, number[]> = new Map();
    if (data) {
      const forecastData = data.getElementsByTagName("time");

      for (let i = 0; i < forecastData.length; i++) {
        const timeNode = forecastData[i];
        const day = timeNode.getAttribute("from")?.split("T")[0];

        if (day) {
          let value = 0;

          switch (weather) {
            case "Temperatura":
              value = parseFloat(
                timeNode
                  .getElementsByTagName("temperature")[0]
                  ?.getAttribute("value") || "0"
              );
              break;

            case "Presión":
              value = parseFloat(
                timeNode
                  .getElementsByTagName("pressure")[0]
                  ?.getAttribute("value") || "0"
              );
              break;

            case "Humedad":
              value = parseFloat(
                timeNode
                  .getElementsByTagName("humidity")[0]
                  ?.getAttribute("value") || "0"
              );
              break;

            default:
              throw new Error(
                `Tipo de meteorología '${meteorology}}' no soportado.`
              );
          }
          if (dictionary.has(day)) {
            dictionary.get(day)?.push(value);
          } else {
            dictionary.set(day, [value]);
          }
        }
      }
    }

    const axis_x: string[] = [];
    const axis_y: number[] = [];

    dictionary.forEach((values, key) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      axis_x.push(key);
      axis_y.push(average);
    });

    const output: GraphInput = {
      axis_X: axis_x,
      axis_Y: axis_y,
    };

    return output;
  };

  const mapCity = (selectedCity: string): void => {
    if (hashCities[selectedCity]) {
      setCords({
        center: hashCities[selectedCity].center,
        zoom: hashCities[selectedCity].zoom,
      });
    }
  };

  const fetchWeatherData = async (
    selectedCity: string,
    selectedMeteorology: string
  ) => {
    try {
      const API_KEY = "27a2bc97a7f2f553eb69e2ad906a8f2f";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${API_KEY}`
      );

      const xmlData = await response.text();

      console.log(xmlData);

      // Parsear el XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlData, "application/xml");

      const timeElement = xml.getElementsByTagName("time")[0]; // Primer intervalo de tiempo
      const temperature =
        timeElement
          ?.getElementsByTagName("temperature")[0]
          ?.getAttribute("value") || "N/A";
      const wind =
        timeElement
          ?.getElementsByTagName("windSpeed")[0]
          ?.getAttribute("mps") || "N/A";
      const humidity =
        timeElement
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
      let list_forecast = Array.from(xml.getElementsByTagName("time"));
      console.log(list_forecast);
      forecast = list_forecast.slice(0, 5).map((timeStamp) => {
        return {
          dateStart: timeStamp.getAttribute("from")?.split("T")[1] || "",
          dateEnd: timeStamp.getAttribute("to")?.split("T")[1] || "",
          precipitation:
            timeStamp
              .getElementsByTagName("precipitation")[0]
              ?.getAttribute("probability") || " ",
          humidity:
            timeStamp
              .getElementsByTagName("humidity")[0]
              ?.getAttribute("value") || " ",
          cloud:
            timeStamp
              .getElementsByTagName("clouds")[0]
              ?.getAttribute("value") || " ",
        };
      });

      setGraphValue(filter_data(selectedMeteorology, xml));
      setItems(forecast);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("d");
    }
  };
  useEffect(() => {
    fetchWeatherData(value, weather);
    console.log(value);
    console.log(graphValues);
    mapCity(value);
  }, [value, weather]);

  let renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]}
        />
      </Grid>
    ));
  };
  return (
    <div className="background">
      <Grid container spacing={5}>
        {/* Primer encabezado  */}
        <Grid size={{ xs: 6, xl: 12 }}>
          <Header_Weather target={value} setTarget={setvalue} />
        </Grid>
        {renderIndicators()}
        {/* Tabla */}

        <Grid size={{ xs: 12, xl: 6 }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, xl: 3 }} container spacing={5}>
              <ControLocation target={value} setTarget={setvalue} />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather itemsIn={item} />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 6 }} className="de">
          <LocationMap center={cords.center} zoom={cords.zoom}></LocationMap>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <ControlWeather target={weather} setTarget={setWeather} />
          {!graphValues ||
          !graphValues.axis_X ||
          !graphValues.axis_Y ||
          graphValues.axis_X.length === 0 ||
          graphValues.axis_Y.length === 0 ? (
            <p>No hay datos disponibles para el gráfico.</p>
          ) : (
            <LineChartWeather arg1={graphValues} tag={"Selected Data"} />
          )}
          {/*<LineChartWeather /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
