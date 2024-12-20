import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import WeatherPro from '../interface/WeatherPro'

export default function ControLocation({target, setTarget}: WeatherPro) {

  
  /* setSelected es la variable de actualización */
  
  
  

  {/* Arreglo de objetos */}
  const items = [
    { name: "Guayaquil", description: "Cantidad de agua que cae sobre una superficie en un período específico." },
    { name: "Quito", description: "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
    { name: "Salinas", description: "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida." },
  ];

  {/* Arreglo de elementos JSX */}
  const options = items.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item.name}
    </MenuItem>
  ));

  {/* Manejador de eventos */}
  const handleChange = (event: SelectChangeEvent) => {
    const e = target;
    console.log(e);
    const idx = parseInt(event.target.value);
    setTarget(items[idx]["name"]);
 
  };


  



  {/* JSX */}
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/** 
      <Typography mb={2} component="h3" variant="h6" color="primary">
        {selected >= 0 ? items[selected].description : ""}
      </Typography>
        */}



      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Ciudades</InputLabel>
          
          <Select
            labelId="simple-select-label"
            id="simple-select"
            label="Variables"
            defaultValue="-1"
            onChange={handleChange}
          >
            <MenuItem key="-1" value="-1" disabled>
              Ciudades
            </MenuItem>
            {options}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
