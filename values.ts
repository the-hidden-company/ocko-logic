import axios from 'axios';
import { set } from './makers/database'

const populate = async () => {


let a = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/prehled-ockovacich-mist.min.json")
console.log(a.data.data.length);
a = null

let b = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-registrace.min.json")
console.log(b.data.data.length);
b = null

let c = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-rezervace.min.json")
console.log(c.data.data.length);
c = null

let e = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovaci-mista.min.json")
console.log(e.data.data.length);
e = null

}

populate()
