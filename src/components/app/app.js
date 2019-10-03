import React, {Component} from 'react';
import Table from "../table";
import Ajax from '../../services';
import Filter  from '../filter'
import Chart, {customFilter}  from '../chart'
import "./app.css";

const ajax = new Ajax();
const filter = new Filter();

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



class App extends Component {
    state = {
        meteors: null,

        mass: null,
        fall:null,
        year: null,
    };

    componentDidMount() {
        this.updateMeteors();
    };


    //блок загрзуки
    onLoad = (json) => {
        filter.set(json);
        this.setState({meteors: json});
    };

    onError = () => {
        this.setState({meteors: "error"});
    };

    updateMeteors() {
        ajax.json(this.props.url)
            .then(this.onLoad)
            .catch(this.onError);
    };




    render() {
        const {meteors, mass, fall, year} = this.state;

        if (!meteors)
            return <>Loading...</>;

        // Вечная загрузка, ошибка или нет, пробуем грузить пока не получится
        if (meteors === "error") {
            //без слипа это будет ад для компьютера
            sleep(1000).then(() => {
                this.updateMeteors();
                this.setState({meteors: null})
            });

            return <>Loading2...</>;
        }

        // Настройки таблицы
        const columns = [
            {property: 'name', header: 'name'},
            {property: 'id', header: 'id'},
            {property: 'nametype', header: 'nametype'},
            {property: 'recclass', header: 'recclass'},
            {property: 'mass', header: 'mass (g)'},
            {property: 'fall', header: 'fall'},
            {property: 'year', header: 'year',
                render:(row={})=> {
                    // Пришлось усложнить условие, когда input в ячейке, выскакивает ошибка
                   if (row.year && typeof row.year === "string" )
                      return giveYear(row.year);
                    else
                      return row.year
                }
            },
            {property: 'reclat', header: 'reclat'},
            {property: 'reclong', header: 'reclong'},
            {property: 'geolocation', header: 'GeoLocation', render: (row) => {
                    const {geolocation: {coordinates = []} = {}} = row;
                    return  (coordinates.length>0) ? `(${coordinates[0]}°, ${coordinates[0]}°)` : row.geolocation;
            }},
            {property: ':@computed_region_cbhk_fwbd', header: '@computed_region_cbhk_fwbd'},
            {property: ':@computed_region_nnqa_25f4', header: '@computed_region_nnqa_25f4'},
        ];

        var ids = ["mass","fall","year"]; //что бы собрать все value по id
        const filters = {
            /*name: <input type="text" className="form-control"/>,
            id: <input type="text" className="form-control"/>,
            nametype: <input type="text" className="form-control"/>,
            recclass: <input type="text" className="form-control"/>,*/

            mass: <input type="text" id="mass" className="form-control" onKeyUp={(e)=>{if (e.keyCode === 13) this.setState(giveAllVal(ids))}}/>,
            fall: (<select name="fall" id="fall"  className="sizeSelect" required onChange={()=>{this.setState(giveAllVal(ids))}}>
                    <option value="all">All</option>
                    <option value="Fell" >Fell</option>
                    <option value="Found">Found</option>
                  </select>),
            year: <input type="text" id="year"  className="form-control " onKeyUp={(e)=>{if (e.keyCode === 13) this.setState(giveAllVal(ids))}}/>,

            /*reclat: <input type="text" className="form-control"/>,
            reclong: <input type="text" className="form-control"/>,
            geolocation: <input type="text" className="form-control"/>,
            ":@computed_region_cbhk_fwbd": <input type="text" className="form-control"/>,
            ":@computed_region_nnqa_25f4": <input type="text" className="form-control"/>,*/
        };



        filter.setFilter({
            "mass": (val)=> (!mass || (val && parseInt(val) >= mass)),
            "fall": (val)=> (!fall || fall === 'all' || val === fall),
            "year": (val)=>{
                if (!this.state.year)
                    return true;

                // Получаю массив из 4 элементов, 0 все выражение, индексы 1-2 это если диапазон лет, 3 это если один год написан
                let years = (/([0-9]{1,5})\s*-\s*([0-9]{1,5})|([0-9]{1,5})/g).exec(this.state.year);
                let year  = val && new Date(val).getFullYear();

                if (!val || !year || years.length!==4)
                    return false;

                return ((years[2] === undefined && year === parseInt(years[3]))  //Если год 1
                        || (year >= years[1] && year <=years[2])) //диапазон лет
            }
        });

        // Наконец применяем фильтр, после всех настроек
        let filterData = filter.get();

        // Указаны год и масса, но метеор не найден
        if (mass && year &&filterData.length===0) {
            filter.addFilter({"year": null});
            filterData = filter.get();
            filterData = filterData.sort((y1, y2)=> (giveYear(y1.year) - giveYear(y2.year)));   //что бы взять первый элемент, сортирую

            if (filterData.length > 0) {
                alert("In "+giveYear(year)+" meteors arenn't found,  but we found similar meteor in "+giveYear(filterData[0].year));
                filterData = [filterData[0]];
            }
       }

        if (filterData.length === 0)
            alert("Meteors aren't found!");

        return <>
                <div className="meteors container-fluid">
                    METEORS: {filterData.length}
                </div>

                <div>
                    <Chart data={customFilter(filterData)}/>
                </div>

                <Table columns={columns} data={[filters, ...filterData]}/>
               </>;
    }
}

// И за того что брал значение из таргета, по событию, была бага, когда значение изменил в строке, а энтер нажал в другом input
// Нужно все поля обновлять mass, fall, year
function giveAllVal(arr){
    let obj = {};
    arr.forEach((v)=> obj[v]=document.getElementById(v).value);
    return obj;
}

function giveYear(year) {
    return year && new Date(year).getFullYear();
}
export default App;
