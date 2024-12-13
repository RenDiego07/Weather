


import WeatherProp from "../interface/WeatherPro"

import { useState, useRef } from "react"

export default function HeaderWeather({target, setTarget}: WeatherPro){


    return(
        <>
            <div className="Header_Weather">
                    <h2>{target}</h2>
            </div>
        </>

    )

}