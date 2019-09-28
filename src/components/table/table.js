import React from 'react';
import './table.css';

//так как юзать td отедльно от таблицы не планируется, все засунул в 1 компонент
function Table(props) {
    const {columns, data} = props;

    const header = columns.map((val, index) => {
        return <th key={"header" + index} scope="col">{val.header}</th>;
    });

    //прохожу по всем строкам
    const renderData = data.map((line, idx)=>{
        //в каждой строке, прохожу по столбцам, и применяю настройки(header, render) для каждой ячейки в строке
        const row = columns.map((val,index) => {
            const {render} = val;

            if (typeof render === "function") {
                return <td key={"td"+index}>{render(line)}</td>
            }
            return <td key={"td"+index}>{line[val.property]}</td>
        });

        return <tr key={"tr"+idx}>{row}</tr>
    });

    return (
        <table className="table table-hover table-bordered" style={{fontSize : "10pt"}}>
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>

            <tbody className="table-sm-my">
                 {renderData}
            </tbody>
        </table>
    );
}

export default Table;