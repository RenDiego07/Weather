


import WeatherProp from "../interface/WeatherPro"

import { useState, useEffect } from "react"


export default function HeaderWeather({target, setTarget}: WeatherProp){
    
    const [fadeClass, setFadeClass] = useState("fade-in");
    const [displayText, setDisplayText] = useState(target)
    const flag = false
    if(flag){
        setTarget("0")
    }

    useEffect(() =>{
                setFadeClass("")
                const timeout = setTimeout(()=>{
                    setDisplayText(target);
                    setFadeClass("fade-in");

                },500)
                return () => clearTimeout(timeout)
    },[target])

    return(
        <>
            <div className="Header_Weather">
                    <h2 className={fadeClass}>{displayText}</h2>
            </div>
        </>

    )

}