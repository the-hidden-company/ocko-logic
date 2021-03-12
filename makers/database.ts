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

const get = {};

const set = {
  async query(
    itemArray: any[],
    type: "mista" | "registrace" | "rezervace"
  ): Promise<StatusMessage> {
    const setup = new Setup();
    await setup.create();
    itemArray.forEach((itm) => {
      let q: string;
      if (type === "mista")
        q = `INSERT INTO \`ockovaci_mista\`(\`misto_id\`, \`misto_nazev\`, \`okres_nuts_kod\`, \`status\`, \`misto_adresa\`, \`latitude\`, \`longitude\`, \`nrpzs_kod\`, \`minimalni_kapacita\`, \`bezbarierovy_pristup\`) VALUES ('${itm.ockovaci_misto_id}','${itm.ockovaci_misto_nazev}','${itm.okres_nuts_kod}',${itm.operacni_status},'${itm.ockovaci_misto_adresa}',${itm.latitude},${itm.longitude},'${itm.nrpzs_kod}',${itm.minimalni_kapacita},${itm.bezbarierovy_pristup})`;
      if (type === "registrace")
        q = `INSERT INTO \`rezervace\`(\`datum\`, \`misto_id\`, \`misto_nazev\`, \`kraj_nuts_kod\`, \`kraj_nazev\`, \`vekova_skupina\`, \`povolani\`, \`stat\`, \`rezervace\`, \`datum_rezervace\`) VALUES ('${
          itm.datum
        }', '${itm.ockovaci_misto_id}', '${itm.ockovaci_misto_nazev}', '${
          itm.kraj_nuts_kod
        }', '${itm.kraj_nazev}','${itm.vekova_skupina}', '${itm.povolani}', '${
          itm.stat
        }', ${itm.rezervace}, ${
          itm.datum_rezervace ? `'${itm.datum_rezervace}'` : "null"
        })`;
      if (type === "rezervace")
        q = `INSERT INTO \`rezervace\`(\`datum\`, \`misto_id\`, \`misto_nazev\`, \`kraj_nuts_kod\`, \`kraj_nazev\`, \`vekova_skupina\`, \`povolani\`, \`stat\`, \`rezervace\`, \`datum_rezervace\`) VALUES ('${
          itm.datum
        }', '${itm.ockovaci_misto_id}', '${itm.ockovaci_misto_nazev}', '${
          itm.kraj_nuts_kod
        }', '${itm.kraj_nazev}','${itm.vekova_skupina}', '${itm.povolani}', '${
          itm.stat
        }', ${itm.rezervace}, ${
          itm.datum_rezervace ? `'${itm.datum_rezervace}'` : "null"
        })`;
      setup.connection.query(q, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    });
    setup.drop();
    return {
      success: true,
      status: 200,
      data: {
        type: type,
        message: "Queries were made",
      },
    };
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
