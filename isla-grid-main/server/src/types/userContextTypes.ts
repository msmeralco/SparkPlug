export type ApplianceUsage = {
  name: string;
  usageIntensity: number; // measurement of frequency and how much the user uses the appliance
};

export type UserContext = {
  userId: string;
  location: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  appliances: ApplianceUsage[];
};


export type CreateUserContextDTO = Omit<UserContext, 'userId'>;