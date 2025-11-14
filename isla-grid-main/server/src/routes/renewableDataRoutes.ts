import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = Router();

interface ProvinceEntry {
  province: string;
  biomass?: { total_available?: number };
  hydropower?: { potential_kw?: number };
  solar?: { ghi_avg?: number };
  wind?: { max_power_density?: number };
}

interface RenewableDataFile {
  provinces: ProvinceEntry[];
}

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and cache the JSON once on server start
const dataPath = path.join(
  __dirname,
  "../../data/ph_renewable_energy_data.json"
);
const raw = fs.readFileSync(dataPath, "utf-8");
const parsed: RenewableDataFile = JSON.parse(raw);

router.get("/mix", (req, res) => {
  const province = String(req.query.province || "");

  if (!province) {
    return res.status(400).json({ error: "Missing province query parameter" });
  }

  const entry = parsed.provinces.find(
    (p) => p.province.toLowerCase() === province.toLowerCase()
  );

  if (!entry) {
    return res.status(404).json({ error: "Province not found" });
  }

  const biomass = entry.biomass?.total_available ?? 0;
  const solar = entry.solar?.ghi_avg ?? 0;
  const hydropower = entry.hydropower?.potential_kw ?? 0;
  const wind = entry.wind?.max_power_density ?? 0;

  return res.json({
    province: entry.province,
    biomass,
    solar,
    hydropower,
    wind,
  });
});

export default router;
