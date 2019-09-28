
function Filter(array, filtersObj) {
    let arr = array ? [...array] : [];
    let result =  [];
    let filters = filtersObj || {}; //обьект функций, названия функций для фильтрации == названием свойств в обьекте arr

    return {
        //на всякий нереальный случай
        set(array) {
            arr = [...array];
        },

        //финальный метод, вызывать для получения данных
        get() {
            this.filter();
            //console.log(result);
            return result ? result : [];

            //плохая идея
            /*(result || this.result.length ==0)
                ?  arr
                :  result;*/
        },

        setFilter(obj) {
            if (obj && typeof obj === 'object')
                filters = obj;
        },


        addFilter(obj) {
            //console.log("do")
            //console.log(filters)
            if (obj && typeof obj === 'object')
                filters = {...filters, ...obj};
                //console.log(filters)
        },

        //собственно сам фильтр
        filter() {
            result = arr.filter((line => {
                if (filters) {
                    //проходим по всем фильтрам
                    for (let [key, func]  of  Object.entries(filters)) {
                        //console.log(key);
                       // console.log(line);
                          //если хоть один фильт вернёт false значит убираем всю строку
                            if (func && !func(line[key]))
                                return false;
                    }
                    return true;
                } else
                   return true;
            }));
        }
    }
}

export default Filter;