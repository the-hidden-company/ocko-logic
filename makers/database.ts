import * as sql from "mysql";
import "../types/dbtypes";

class Setup {
  constructor() {}
  public create = () => {
    console.log("Connecting");
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) return reject(err);
        else resolve("OK");
      });
    });
  };
  public drop = () => {
    console.log("Dropping");

    this.connection.end();
  };
  public connection = sql.createConnection({
    host: "localhost",
    user: "admin",
    password: "quviaSQLtoor",
    database: "ockovanirychle",
  });
}

const get = {
  query(query: string): Promise<StatusMessage> {
    const setup = new Setup();
    setup.create();
    console.log(query);

    return new Promise((resolve, reject) => {
      setup.connection.query(query, (err, result) => {
        if (err)
          resolve({
            success: false,
            status: 500,
            data: err,
          });
        else
          resolve({
            success: true,
            status: 200,
            data: result,
          });
      });
    });
  },

  async pomer(mista: string[], ageGroup: string): Promise<StatusMessage> {
    const d = await get.query(
      `SELECT misto_nazev, rezervace, COUNT(*) as number FROM \`registrace\` WHERE \`vekova_skupina\`='${ageGroup}'
       AND \`misto_id\` IN ('${mista.join(
         "', '"
       )}') GROUP BY \`rezervace\`, \`misto_nazev\``
    );
    let mistaO: any[] = [];
    d.data.forEach((r) => {
      const index = mistaO.map((e) => e.misto_nazev).indexOf(r.misto_nazev);
      if (index === -1) {
        let newMisto = {
          misto_nazev: r.misto_nazev,
          true: r.rezervace ? r.number : 0,
          false: r.rezervace ? 0 : r.number,
          pomer: 0,
        };
        mistaO.push(newMisto);
      } else {
        mistaO[index][r.rezervace ? "true" : "false"] = r.number;
        mistaO[index].pomer = mistaO[index].true / mistaO[index].false;
        if (mistaO[index].true < 100 && mistaO[index].false < 100) {
          console.log(mistaO[index].misto_nazev);
          mistaO.splice(index, 1);
        }
      }
    });
    mistaO.sort((a, b) => (a.pomer < b.pomer ? 1 : -1));
    return {
      success: d.success,
      status: d.status,
      data: mistaO,
    };
  },

  async pocet(mista: string[], ageGroup: string): Promise<StatusMessage> {
    const qry = await get.query(`SELECT COUNT(*) as count FROM registrace`)
    return {
      success: true,
      status: 200,
      data: ""
    }
  }
};

const set = {
  async query(
    itemArray: any[],
    type: "ockovaci_mista" | "registrace" | "rezervace" | "ockovani"
  ): Promise<StatusMessage> {
    console.log(type);

    const setup = new Setup();
    await setup.create();
    return new Promise<StatusMessage>((resolve, reject) => {
      itemArray.forEach((itm, i) => {
        let q: string;
        if (type === "ockovaci_mista")
          q = `INSERT INTO \`ockovaci_mista\`(\`misto_id\`, \`misto_nazev\`, \`okres_nuts_kod\`, \`status\`, \`misto_adresa\`, \`latitude\`, \`longitude\`, \`nrpzs_kod\`, \`minimalni_kapacita\`, \`bezbarierovy_pristup\`) VALUES ('${itm.ockovaci_misto_id}','${itm.ockovaci_misto_nazev}','${itm.okres_nuts_kod}',${itm.operacni_status},'${itm.ockovaci_misto_adresa}',${itm.latitude},${itm.longitude},'${itm.nrpzs_kod}',${itm.minimalni_kapacita},${itm.bezbarierovy_pristup})`;
        if (type === "registrace")
          q = `INSERT INTO \`registrace\`(\`datum\`, \`misto_id\`, \`misto_nazev\`, \`kraj_nuts_kod\`, \`kraj_nazev\`, \`vekova_skupina\`, \`povolani\`, \`stat\`, \`rezervace\`, \`datum_rezervace\`) VALUES ('${
            itm.datum
          }', '${itm.ockovaci_misto_id}', '${itm.ockovaci_misto_nazev}', '${
            itm.kraj_nuts_kod
          }', '${itm.kraj_nazev}','${itm.vekova_skupina}', '${
            itm.povolani
          }', '${itm.stat}', ${itm.rezervace}, ${
            itm.datum_rezervace ? `'${itm.datum_rezervace}'` : "null"
          })`;
        if (type === "rezervace")
          q = `INSERT INTO \`rezervace\`(\`datum\`, \`misto_id\`, \`misto_nazev\`, \`kraj_nuts_kod\`, \`kraj_nazev\`, \`volna_kapacita\`, \`maximalni_kapacita\`, \`kalendar_ockovani\`) VALUES ('${itm.datum}', '${itm.ockovaci_misto_id}', '${itm.ockovaci_misto_nazev}', '${itm.kraj_nuts_kod}', '${itm.kraj_nazev}',${itm.volna_kapacita}, ${itm.maximalni_kapacita}, '${itm.kalendar_ockovani}')`;
        if (type === "ockovani")
          q = `INSERT INTO \`ockovani\`(\`datum\`, \`vakcina\`, \`kraj_nuts_kod\`, \`kraj_nazev\`, \`misto_kod\`, \`misto_nazev\`, \`poradi_davky\`, \`vekova_skupina\`) VALUES ('${itm.datum}', '${itm.vakcina}', '${itm.kraj_nuts_kod}', '${itm.kraj_nazev}','${itm.zarizeni_kod}', '${itm.zarizeni_nazev}', ${itm.poradi_davky}, '${itm.vekova_skupina}')`;
        setup.connection.query(q, (err, res) => {
          if (err) {
            console.log(err);
          }
          if (i === itemArray.length - 1) {
            resolve({
              success: true,
              status: 200,
              data: {
                type: type,
                message: "Queries were made",
              },
            });
          }
        });
      });
      setup.drop();
    });
  },
  async del(type: string): Promise<any> {
    const setup = new Setup();
    await setup.create();

    setup.connection.query(`DELETE FROM \`${type}\` WHERE 1`);

    setup.drop();

    return "OK";
  },
};

export { get, set };
