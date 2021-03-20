import axios from 'axios';
import { set } from './makers/database'

const populate = async () => {


// let a = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/prehled-ockovacich-mist.min.json")
// set.del("ockovaci_mista")
// console.log(await set.query(a.data.data, 'ockovaci_mista'));
// a = null

// let b = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-registrace.min.json")
// set.del("registrace")
// console.log(await set.query(b.data.data, 'registrace'));
// b = null

let c = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-rezervace.min.json")
set.del("rezervace")
console.log(await set.query(c.data.data, 'rezervace'));
c = null

let e = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovaci-mista.min.json")
set.del("ockovani")
console.log(await set.query(e.data.data, 'ockovani'));
e = null

}

populate()
