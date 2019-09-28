export default class Ajax {
    get = async (url)=> {
        let res, count = 4;
        do {
            res = await fetch(url);
           --count;
           //console.log(res);
        } while (!res.ok && count>0);

        if (!res.ok)
            throw Error("Content doesn't loaded");

        return res;
    };

    json = async (url)=> {
        return (await this.get(url)).json();
    }
}
