export type ApplianceUsage = {
  name: string;
  usageIntensity: number; // measurement of frequency and how much the user uses the appliance
};

export type ContextValue = {
  location: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  appliances: ApplianceUsage[];
};

export type Context = {
  userId: string;
  contextValue: ContextValue; // value of the context to be fed to the ai
};



