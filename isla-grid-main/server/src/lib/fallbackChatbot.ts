export interface BiomassResource {
  total_available?: number;
  viability?: string;
  [key: string]: number | string | undefined;
}

export interface HydropowerResource {
  potential_kw?: number;
  viability?: string;
}

export interface SolarResource {
  ghi_avg?: number;
  viability?: string;
}

export interface WindResource {
  max_power_density?: number;
  viability?: string;
}

export interface ProvinceEnergyRecord {
  province: string;
  biomass?: BiomassResource;
  hydropower?: HydropowerResource;
  solar?: SolarResource;
  wind?: WindResource;
  recommended_primary?: string[];
  recommended_secondary?: string[];
}

export interface RenewableDatasetMetadata {
  source?: string;
  description?: string;
}

export interface RenewableDataset {
  metadata?: RenewableDatasetMetadata;
  provinces?: ProvinceEnergyRecord[];
}

const DEFAULT_ASSISTANT_MESSAGE =
  "I'm IslaBot, IslaGrid's renewable energy planning assistant. Share your barangay, province, demand profile, and budget so we can scope the right mix of solar, wind, hydro, storage, and community financing tools.";

export class FallbackEnergyAdvisor {
  private readonly provinceIndex: Map<string, ProvinceEnergyRecord> = new Map();

  constructor(private readonly dataset: RenewableDataset) {
    for (const record of dataset.provinces ?? []) {
      if (record?.province) {
        this.provinceIndex.set(
          this.normalizeProvinceName(record.province),
          record
        );
      }
    }
  }

  public getProvinceCount(): number {
    return this.provinceIndex.size;
  }

  public getProvinceByName(name: string): ProvinceEnergyRecord | undefined {
    if (!name) {
      return undefined;
    }

    return this.provinceIndex.get(this.normalizeProvinceName(name));
  }

  public getProvinceFromMessage(
    message: string
  ): ProvinceEnergyRecord | undefined {
    if (!message) {
      return undefined;
    }

    const normalizedMessage = this.normalizeText(message);

    for (const [key, record] of this.provinceIndex.entries()) {
      if (normalizedMessage.includes(key)) {
        return record;
      }
    }

    return undefined;
  }

  public summarizeProvince(record: ProvinceEnergyRecord): string {
    const summary: Array<string | undefined> = [
      `Province: ${record.province}`,
      record.solar?.ghi_avg !== undefined
        ? `Solar GHI avg: ${record.solar.ghi_avg.toLocaleString()} Wh/m²/day (${
            record.solar.viability ?? "viability unknown"
          })`
        : undefined,
      record.wind?.max_power_density !== undefined
        ? `Wind power density: ${record.wind.max_power_density.toLocaleString()} W/m² (${
            record.wind.viability ?? "viability unknown"
          })`
        : undefined,
      record.hydropower?.potential_kw !== undefined
        ? `Hydropower potential: ${record.hydropower.potential_kw.toLocaleString()} kW (${
            record.hydropower.viability ?? "viability unknown"
          })`
        : undefined,
      record.biomass?.total_available !== undefined
        ? `Biomass availability: ${record.biomass.total_available.toLocaleString()} MJ/ha (${
            record.biomass.viability ?? "viability unknown"
          })`
        : undefined,
      record.recommended_primary?.length
        ? `Primary technologies: ${record.recommended_primary.join(", ")}`
        : undefined,
      record.recommended_secondary?.length
        ? `Secondary options: ${record.recommended_secondary.join(", ")}`
        : undefined,
    ];

    return summary.filter(Boolean).join("\n");
  }

  public generateResponse(message: string): {
    reply: string;
    province?: ProvinceEnergyRecord;
  } {
    const province = this.getProvinceFromMessage(message);

    if (province) {
      const provinceSummary = this.summarizeProvince(province);
      const reply = [
        `Here's what IslaGrid's resource dataset highlights for ${province.province}:`,
        provinceSummary,
        "Use these resource insights to scope solar arrays, mini-hydro, wind, or biomass hybrids, then share your demand profile so we can size the system and financing.",
      ].join("\n");

      return { reply, province };
    }

    const lines: string[] = [DEFAULT_ASSISTANT_MESSAGE];

    if (this.dataset.metadata?.description) {
      lines.push(this.dataset.metadata.description);
    }

    if (this.dataset.metadata?.source) {
      lines.push(`Dataset source: ${this.dataset.metadata.source}.`);
    }

    lines.push(
      "Tell me your province, estimated households or daily kWh demand, available land or river resources, and budget priorities to unlock a tailored community energy plan."
    );

    return { reply: lines.join("\n\n") };
  }

  private normalizeProvinceName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, " ").trim();
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
