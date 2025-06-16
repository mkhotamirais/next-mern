import { NextRequest } from "next/server";

const baseUrl = "https://emsifa.github.io/api-wilayah-indonesia/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    let url = "";

    switch (type) {
      case "provinces":
        url = `${baseUrl}/provinces.json`;
        break;
      case "regencies":
        const provinceId = searchParams.get("provinceId");
        if (!provinceId) return new Response("Missing provinceId", { status: 400 });
        url = `${baseUrl}/regencies/${provinceId}.json`;
        break;
      case "districts":
        const regencyId = searchParams.get("regencyId");
        if (!regencyId) return new Response("Missing regencyId", { status: 400 });
        url = `${baseUrl}/districts/${regencyId}.json`;
        break;
      case "villages":
        const districtId = searchParams.get("districtId");
        if (!districtId) return new Response("Missing districtId", { status: 400 });
        url = `${baseUrl}/villages/${districtId}.json`;
        break;
      default:
        return new Response("Invalid type", { status: 400 });
    }

    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
