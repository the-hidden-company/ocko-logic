import axios from 'axios';
import { set } from './makers/database'

const populate = async () => {


const a = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/prehled-ockovacich-mist.min.json")
set.del("ockovaci_mista")
console.log(set.query(a.data.data, 'mista'));

const c = await axios.get("https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-registrace.min.json")
set.del("registrace")
console.log(set.query(c.data.data, 'registrace'));
}

populate()