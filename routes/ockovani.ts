import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../makers/database";

export default async (request: Request, h: ResponseToolkit) => {
  const payload = request.payload as any;

  if (payload.mista && payload.ageGroup)
    return await get.ockovani(payload.mista, payload.ageGroup);
  else
    return {
      success: false,
      status: 423,
      data: "Invalid Parametrs Specified",
    };
};
