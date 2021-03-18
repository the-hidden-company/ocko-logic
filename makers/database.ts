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
    const qry = await get.query(
      `SELECT 
        misto_nazev, 
        COUNT(*) as registrace, 
        COUNT(CASE rezervace WHEN 1 THEN 1 ELSE null END) as rezervace, 
        COUNT(CASE rezervace WHEN 1 THEN 1 ELSE null END) / COUNT(*) as pomer

      FROM \`registrace\` 
      WHERE \`vekova_skupina\` = '${ageGroup}'
        AND \`misto_id\` IN ('${mista.join("', '")}') 
      GROUP BY \`misto_nazev\``
    );

    return {
      success: qry.success,
      status: qry.status,
      data: qry.data,
    };
  },

  async ockovani(mista: string[], ageGroup: string): Promise<StatusMessage> {
    const qry = await get.query(`
      SELECT 
        COUNT(*) as total,  
        COUNT(CASE WHEN ockovani.vakcina = "Comirnaty" OR ockovani.vakcina = "COVID-19 Vaccine Moderna" THEN 1 ELSE null END) as mrna, 
          COUNT(CASE WHEN ockovani.vakcina = "Comirnaty" THEN 1 ELSE null END) as pfizer, 
        COUNT(CASE WHEN ockovani.vakcina = "COVID-19 Vaccine Moderna" THEN 1 ELSE null END) as moderna, 
          COUNT(CASE ockovani.vakcina WHEN "COVID-19 Vaccine AstraZeneca" THEN 1 ELSE null END) as astra,
        COUNT(CASE ockovani.vakcina WHEN "COVID-19 Vaccine AstraZeneca" THEN 1 ELSE null END) 
            / 
            COUNT(CASE WHEN ockovani.vakcina = "Comirnaty" OR ockovani.vakcina = "COVID-19 Vaccine Moderna" THEN 1 ELSE null END)
            as pomer
      
      FROM ockovani
      
      JOIN ockovaci_mista ON ockovaci_mista.nrpzs_kod = ockovani.misto_kod 
      
      WHERE vekova_skupina = '${ageGroup}'
        AND ockovaci_mista.misto_id IN ('${mista.join("', '")}')`);

    return {
      success: qry.success,
      status: qry.status,
      data: qry.data,
    };
  },
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
