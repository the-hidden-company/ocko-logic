import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../makers/database";

const getLide = async (mista: string[]) => {
  return await get.query(
    `SELECT misto_nazev, misto_adresa, minimalni_kapacita FROM ockovaci_mista WHERE misto_id IN ('${mista.join("', '")}')`
  );
};

export default async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as {
    mista: string[];
  };
  if (payload.mista) return await getLide(payload.mista);
  else
    return {
      success: false,
      status: 423,
    };
};
