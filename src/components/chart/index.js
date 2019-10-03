import Chart from './chart';

// json to [{year:1980, count:9}]
// Функция выполняет конкретную задачу, пусть будет здесь
function customFilter(array) {
    let indexTemp = [];
    let dataChart = [];
    array.forEach((val)=>{
        if (!val.year)
            return;
        const year = new Date(val.year).getFullYear();
        indexTemp[year] =  indexTemp[year] ? indexTemp[year]+1: 1
    });
    //console.log(indexTemp);
    for (let [key, val] of Object.entries(indexTemp)){
        dataChart.push({x:key, y:val});
    }
    return dataChart.sort((y1, y2)=>(y1.year-y2.year));
}


export default Chart;
export {customFilter};