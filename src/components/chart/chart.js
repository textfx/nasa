import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

//Если передать массив формата [{x:val, y:val},{x:val, y:val}] можно отрисовать что угодно на графике
function Chart(props) {
    return (
        <div style={{ width: '97%', height: '300px', "marginBottom":"40px"}}>
            <ResponsiveContainer>
                <LineChart data={props.data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="y" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="x" />
                    <YAxis/>
                    <Tooltip  />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}



export default Chart;