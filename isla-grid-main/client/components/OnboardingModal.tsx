"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  MapPin,
  Wallet,
  Zap,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { provinces } from "@/lib/philippineProvinces";

export interface ApplianceUsage {
  name: string;
  usageIntensity: number;
}

export interface OnboardingData {
  location: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  appliances: ApplianceUsage[];
}

type OnboardingStep =
  | "welcome"
  | "location"
  | "financial"
  | "appliances"
  | "review"
  | "complete";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  isLoading?: boolean;
}

const COMMON_APPLIANCES = [
  "Refrigerator",
  "Air Conditioner",
  "Washing Machine",
  "Television",
  "Microwave",
  "Water Heater",
  "Ceiling Fan",
  "Rice Cooker",
];

const OnboardingModal = ({
  isOpen,
  onComplete,
  isLoading = false,
}: OnboardingModalProps) => {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [formData, setFormData] = useState<OnboardingData>({
    location: "",
    monthlyIncome: 0,
    monthlyExpenses: 0,
    appliances: [],
  });
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    usageIntensity: 50,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  if (!isOpen) return null;

  const steps: OnboardingStep[] = [
    "welcome",
    "location",
    "financial",
    "appliances",
    "review",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(step);

  // Filter provinces based on search
  const filteredProvinces = provinces.filter((province) =>
    province.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Validation functions
  const validateLocation = (value: string): string | null => {
    if (!value.trim()) return "Province is required";
    if (!provinces.includes(value)) return "Please select a valid province";
    return null;
  };

  const validateIncome = (value: number): string | null => {
    if (value <= 0) return "Monthly income must be greater than 0";
    if (value > 999999999) return "Monthly income is too high";
    return null;
  };

  const validateExpenses = (value: number, income: number): string | null => {
    if (value < 0) return "Monthly expenses cannot be negative";
    if (value >= income) return "Expenses must be less than income";
    if (value > 999999999) return "Monthly expenses is too high";
    return null;
  };

  const validateApplianceName = (value: string): string | null => {
    if (!value.trim()) return "Appliance name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 50) return "Name must be less than 50 characters";
    return null;
  };

  // Validate step
  const isStepValid = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case "location":
        const locationError = validateLocation(formData.location);
        if (locationError) newErrors.location = locationError;
        break;
      case "financial":
        const incomeError = validateIncome(formData.monthlyIncome);
        if (incomeError) newErrors.income = incomeError;
        const expenseError = validateExpenses(
          formData.monthlyExpenses,
          formData.monthlyIncome
        );
        if (expenseError) newErrors.expenses = expenseError;
        break;
      case "appliances":
        if (formData.appliances.length === 0) {
          newErrors.appliances = "Add at least one appliance";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationSelect = (province: string) => {
    setFormData({ ...formData, location: province });
    setLocationDropdownOpen(false);
    setLocationSearch("");

    if (touched.location) {
      const error = validateLocation(province);
      setErrors((prev) => ({
        ...prev,
        location: error || undefined,
      }));
    }
  };

  const handleIncomeChange = (value: number) => {
    setFormData({ ...formData, monthlyIncome: value });
    if (touched.income) {
      const error = validateIncome(value);
      setErrors((prev) => ({
        ...prev,
        income: error || undefined,
      }));
    }
  };

  const handleExpensesChange = (value: number) => {
    setFormData({ ...formData, monthlyExpenses: value });
    if (touched.expenses) {
      const error = validateExpenses(value, formData.monthlyIncome);
      setErrors((prev) => ({
        ...prev,
        expenses: error || undefined,
      }));
    }
  };

  const handleAddAppliance = () => {
    const nameError = validateApplianceName(newAppliance.name);
    if (nameError) {
      setErrors({ appliances: nameError });
      return;
    }

    if (
      formData.appliances.some(
        (app) => app.name.toLowerCase() === newAppliance.name.toLowerCase()
      )
    ) {
      setErrors({ appliances: "This appliance is already added" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      appliances: [
        ...prev.appliances,
        {
          name: newAppliance.name.trim(),
          usageIntensity: newAppliance.usageIntensity,
        },
      ],
    }));

    setNewAppliance({ name: "", usageIntensity: 50 });
    setErrors({});
  };

  const handleRemoveAppliance = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      appliances: prev.appliances.filter((_, i) => i !== index),
    }));
  };

  const handleAddCommonAppliance = (applianceName: string) => {
    if (formData.appliances.some((app) => app.name === applianceName)) {
      setErrors({ appliances: "This appliance is already added" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      appliances: [
        ...prev.appliances,
        {
          name: applianceName,
          usageIntensity: 50,
        },
      ],
    }));
    setErrors({});
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
      setErrors({});
    }
  };

  const handleComplete = () => {
    if (!isStepValid()) return;
    onComplete(formData);
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    if (fieldName === "location") {
      const error = validateLocation(formData.location);
      setErrors((prev) => ({
        ...prev,
        location: error || undefined,
      }));
    } else if (fieldName === "income") {
      const error = validateIncome(formData.monthlyIncome);
      setErrors((prev) => ({
        ...prev,
        income: error || undefined,
      }));
    } else if (fieldName === "expenses") {
      const error = validateExpenses(
        formData.monthlyExpenses,
        formData.monthlyIncome
      );
      setErrors((prev) => ({
        ...prev,
        expenses: error || undefined,
      }));
    }
  };

  const surplus = formData.monthlyIncome - formData.monthlyExpenses;
  const savingsPercentage =
    formData.monthlyIncome > 0
      ? ((surplus / formData.monthlyIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl md:p-12 max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            {steps.map((s, idx) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= currentStepIndex ? "bg-[#FC7019]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* STEP 1: Welcome */}
        {step === "welcome" && (
          <div className="space-y-6 text-center py-4">
            <div>
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FC7019] to-orange-600 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-[#131B28]">
                Welcome to IslaGrid
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Let's set up your personalized energy profile
              </p>
            </div>

            <div className="space-y-3 rounded-xl bg-gradient-to-br from-[#FFF5EB] to-orange-50 p-6 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-[#FC7019] mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#131B28]">
                    Location Assessment
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll identify renewable energy potential in your area
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Wallet className="h-6 w-6 text-[#FC7019] mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#131B28]">
                    Financial Profile
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Affordable energy solutions tailored to your budget
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-[#FC7019] mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#131B28]">Energy Usage</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Track appliances to optimize consumption patterns
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === "location" && (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#131B28] flex items-center gap-2">
                <MapPin className="h-6 w-6 text-[#FC7019]" />
                Where are you located?
              </h2>
              <p className="mt-2 text-gray-600">
                Select your province to identify renewable energy potential
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-[#131B28] mb-2">
                  Province <span className="text-red-500">*</span>
                </label>

                {/* Province Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setLocationDropdownOpen(!locationDropdownOpen)
                    }
                    onBlur={() => handleFieldBlur("location")}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-gray-900 transition focus:outline-none focus:ring-2 flex items-center justify-between ${
                      errors.location
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#FC7019] focus:ring-[#FC7019]/20"
                    }`}
                  >
                    <span
                      className={
                        formData.location
                          ? "text-gray-900 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {formData.location || "Select a province..."}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 transition-transform ${
                        locationDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {locationDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setLocationDropdownOpen(false)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-hidden flex flex-col">
                        {/* Search Input */}
                        <input
                          type="text"
                          placeholder="Search provinces..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="sticky top-0 px-4 py-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC7019]/20 text-sm"
                          autoFocus
                        />

                        {/* Province Options */}
                        <div className="overflow-y-auto">
                          {filteredProvinces.length > 0 ? (
                            filteredProvinces.map((province) => (
                              <button
                                key={province}
                                onClick={() => handleLocationSelect(province)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#FC7019]/10 hover:text-[#FC7019] ${
                                  formData.location === province
                                    ? "bg-[#FC7019]/20 text-[#FC7019] font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {province}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                              No provinces found
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {errors.location && (
                  <div className="mt-2 flex gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{errors.location}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold mb-1">💡 Why we ask:</p>
                <p>
                  Your province helps us assess solar radiation, wind patterns,
                  and hydro potential specific to your area for optimal energy
                  solutions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!!errors.location && touched.location}
                className="flex-1 rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Profile */}
        {step === "financial" && (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#131B28] flex items-center gap-2">
                <Wallet className="h-6 w-6 text-[#FC7019]" />
                Financial Profile
              </h2>
              <p className="mt-2 text-gray-600">
                Help us recommend affordable energy solutions
              </p>
            </div>

            <div className="space-y-4">
              {/* Monthly Income */}
              <div>
                <label className="block text-sm font-semibold text-[#131B28] mb-2">
                  Monthly Income <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-600 font-semibold">
                    ₱
                  </span>
                  <input
                    type="number"
                    placeholder="25000"
                    value={formData.monthlyIncome || ""}
                    onChange={(e) =>
                      handleIncomeChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={() => handleFieldBlur("income")}
                    className={`w-full rounded-lg border pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 ${
                      errors.income
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#FC7019] focus:ring-[#FC7019]/20"
                    }`}
                  />
                </div>
                {errors.income && (
                  <div className="mt-2 flex gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{errors.income}</span>
                  </div>
                )}
              </div>

              {/* Monthly Expenses */}
              <div>
                <label className="block text-sm font-semibold text-[#131B28] mb-2">
                  Monthly Expenses <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-600 font-semibold">
                    ₱
                  </span>
                  <input
                    type="number"
                    placeholder="15000"
                    value={formData.monthlyExpenses || ""}
                    onChange={(e) =>
                      handleExpensesChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={() => handleFieldBlur("expenses")}
                    className={`w-full rounded-lg border pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 ${
                      errors.expenses
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#FC7019] focus:ring-[#FC7019]/20"
                    }`}
                  />
                </div>
                {errors.expenses && (
                  <div className="mt-2 flex gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{errors.expenses}</span>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              {formData.monthlyIncome > 0 && (
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 space-y-3 border border-green-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">
                      Monthly Surplus:
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        surplus >= 0 ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      ₱{surplus.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Savings Rate:</span>
                    <span className="font-semibold text-green-700">
                      {savingsPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                      style={{
                        width: `${Math.min(
                          parseFloat(savingsPercentage as string),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    This helps us calculate sustainable energy investment
                    options for you.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!!errors.income || !!errors.expenses}
                className="flex-1 rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Appliances */}
        {step === "appliances" && (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#131B28] flex items-center gap-2">
                <Zap className="h-6 w-6 text-[#FC7019]" />
                Appliances & Usage
              </h2>
              <p className="mt-2 text-gray-600">
                List appliances to help us estimate your energy needs
              </p>
            </div>

            {/* Add Appliance Section */}
            <div className="space-y-4 rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50/50">
              <div>
                <label className="block text-sm font-semibold text-[#131B28] mb-2">
                  Appliance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Refrigerator"
                  value={newAppliance.name}
                  onChange={(e) =>
                    setNewAppliance({ ...newAppliance, name: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleAddAppliance()}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-[#FC7019] focus:outline-none focus:ring-2 focus:ring-[#FC7019]/20"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-[#131B28]">
                    Usage Intensity
                  </label>
                  <span className="text-sm font-semibold text-[#FC7019]">
                    {newAppliance.usageIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newAppliance.usageIntensity}
                  onChange={(e) =>
                    setNewAppliance({
                      ...newAppliance,
                      usageIntensity: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#FC7019]"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-600 font-medium">
                  <span>Low (1-33%)</span>
                  <span>Medium (34-66%)</span>
                  <span>High (67-100%)</span>
                </div>
              </div>

              {errors.appliances && (
                <div className="flex gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{errors.appliances}</span>
                </div>
              )}

              <button
                onClick={handleAddAppliance}
                disabled={!newAppliance.name.trim()}
                className="w-full rounded-lg bg-[#FC7019] px-4 py-2 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" /> Add Appliance
              </button>
            </div>

            {/* Quick Add Common Appliances */}
            {formData.appliances.length < 5 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Quick add common appliances:
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {COMMON_APPLIANCES.map((app) => (
                    <button
                      key={app}
                      onClick={() => handleAddCommonAppliance(app)}
                      disabled={formData.appliances.some((a) => a.name === app)}
                      className="text-xs px-2 py-1.5 rounded border border-gray-300 hover:border-[#FC7019] hover:bg-[#FFF5EB] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      + {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Appliances List */}
            {formData.appliances.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#131B28]">
                    Added Appliances ({formData.appliances.length})
                  </h3>
                  <span className="text-xs text-gray-600">
                    Avg intensity:{" "}
                    {Math.round(
                      formData.appliances.reduce(
                        (acc, app) => acc + app.usageIntensity,
                        0
                      ) / formData.appliances.length
                    )}
                    %
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {formData.appliances.map((appliance, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-200 hover:border-[#FC7019] transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#131B28] truncate">
                          {appliance.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FC7019]"
                              style={{ width: `${appliance.usageIntensity}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 min-w-[2rem]">
                            {appliance.usageIntensity}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAppliance(idx)}
                        className="ml-2 rounded-lg p-2 text-red-600 transition hover:bg-red-50 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.appliances.length === 0 && (
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900 border border-blue-200">
                <p className="font-semibold mb-1">
                  💡 Appliance tracking helps us:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Estimate your total energy consumption</li>
                  <li>Recommend optimal solar panel capacity</li>
                  <li>Calculate potential savings from renewable energy</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={formData.appliances.length === 0}
                className="flex-1 rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Review <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review */}
        {step === "review" && (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#131B28]">
                Review Your Profile
              </h2>
              <p className="mt-2 text-gray-600">
                Make sure everything looks correct before we save
              </p>
            </div>

            <div className="space-y-3">
              {/* Location */}
              <div className="rounded-lg border border-gray-200 p-4 hover:border-[#FC7019] transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">
                      📍 Province
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#131B28]">
                      {formData.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("location")}
                    className="text-xs text-[#FC7019] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Financial */}
              <div className="rounded-lg border border-gray-200 p-4 hover:border-[#FC7019] transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600">
                      💰 Financial Profile
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Monthly Income</p>
                        <p className="text-sm font-semibold text-[#131B28]">
                          ₱{formData.monthlyIncome.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          Monthly Expenses
                        </p>
                        <p className="text-sm font-semibold text-[#131B28]">
                          ₱{formData.monthlyExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Monthly Surplus</p>
                        <p className="text-sm font-semibold text-green-700">
                          ₱{surplus.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Savings Rate</p>
                        <p className="text-sm font-semibold text-green-700">
                          {savingsPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("financial")}
                    className="text-xs text-[#FC7019] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Appliances */}
              <div className="rounded-lg border border-gray-200 p-4 hover:border-[#FC7019] transition">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-600">
                    ⚡ Appliances ({formData.appliances.length})
                  </p>
                  <button
                    onClick={() => setStep("appliances")}
                    className="text-xs text-[#FC7019] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.appliances.map((app, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded-full bg-[#FC7019]/10 px-3 py-1 text-xs text-[#FC7019] font-medium"
                    >
                      {app.name} ({app.usageIntensity}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-4 border border-green-200 text-sm text-green-900">
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Profile Ready!</p>
                  <p className="text-xs mt-1">
                    Your energy profile is complete. Click Save to unlock
                    personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 flex items-center justify-center gap-2"
              >
                Save & Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Complete */}
        {step === "complete" && (
          <div className="space-y-6 text-center py-8">
            <div>
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#131B28]">
                Profile Complete!
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Your energy profile has been created successfully
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-[#FFF5EB] to-orange-50 p-6 text-left space-y-4 border border-orange-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✓</span> Province selected
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✓</span> Financial profile
                recorded
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✓</span>{" "}
                {formData.appliances.length} appliances tracked
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-left border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Next:</span> IslaBot will now
                provide personalized energy recommendations and help you
                optimize your consumption to reduce costs and maximize
                sustainability in your province.
              </p>
            </div>

            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full rounded-lg bg-[#FC7019] px-6 py-3 font-semibold text-white transition hover:bg-[#E5640F] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Start Energy Planning <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
