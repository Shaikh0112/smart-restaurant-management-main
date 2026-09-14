// @ts-nocheck
"use client";

// RESPONSIBILITY: Hotel Profile Onboarding Creation Wizard (`/manager/onboarding`).
// Collects restaurant details (Basic info, Location, FSSAI, GSTIN, Logo/Banner, UPI VPA).
// Submits application to Super Admin Verification Queue (status: APPROVAL_PENDING).
// DATA FLOW: owner/onboarding/page.tsx -> registerNewTenant() -> owner/dashboard/page.tsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { registerNewTenant } from "@/lib/tenantService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// --- Schema ---
const onboardingSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  tagline: z.string().optional(),
  cuisineTypes: z.string().min(1, "Cuisines are required"),
  costForTwo: z.coerce.number().min(1, "Average cost is required"),
  city: z.string().min(1, "City is required"),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  fssaiNumber: z.string().optional(),
  gstinNumber: z.string().optional(),
  upiVpa: z.string().optional(),
  openingTime: z.string().default("11:00 AM"),
  closingTime: z.string().default("11:00 PM"),
  logoUrl: z.string().default("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80"),
  bannerUrl: z.string().default("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// --- Custom Hooks ---
function useBeforeUnload(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Standard requirement for modern browsers
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}

// --- Wizard Configuration ---
const STEPS = [
  {
    id: "Step 1",
    name: "Basic Info",
    fields: ["restaurantName", "tagline", "cuisineTypes", "costForTwo"] as const,
    icon: Building2,
  },
  {
    id: "Step 2",
    name: "Location",
    fields: ["city", "landmark", "pincode", "address"] as const,
    icon: MapPin,
  },
  {
    id: "Step 3",
    name: "Credentials",
    fields: ["fssaiNumber", "gstinNumber", "upiVpa"] as const,
    icon: FileCheck,
  },
];

export default function ManagerOnboardingClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      restaurantName: "",
      tagline: "",
      cuisineTypes: "North Indian, Biryani, Mughlai",
      costForTwo: 1000,
      city: "Bengaluru",
      landmark: "",
      pincode: "",
      address: "",
      fssaiNumber: "",
      gstinNumber: "",
      upiVpa: "",
    },
    mode: "onBlur",
  });

  useBeforeUnload(isDirty);

  const processForm = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    const cuisinesArray = data.cuisineTypes.split(",").map((c) => c.trim());

    setTimeout(() => {
      registerNewTenant({
        ...data,
        cuisineTypes: cuisinesArray,
      });
      toast.success("Restaurant application submitted successfully!");
      router.push("/manager/dashboard");
    }, 800);
  };

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep].fields;
    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((step) => step - 1);
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 text-text-primary">
      <div className="mx-auto max-w-3xl">
        {/* Header & Progress Indicator */}
        <div className="mb-8 rounded-3xl border border-border/80 bg-card p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30">
                {React.createElement(STEPS[currentStep].icon, { size: 24 })}
              </div>
              <div>
                <h1 className="font-black text-xl text-text-primary">
                  Restaurant Onboarding Profile
                </h1>
                <p className="text-xs text-text-secondary mt-1">
                  Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].name}
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-1 text-xs font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <Sparkles size={13} />
              Under Onboarding Setup
            </span>
          </div>

          {/* Stepper Steps */}
          <div className="mt-6 flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs ${
                      index < currentStep
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : index === currentStep
                        ? "bg-primary border-primary text-white"
                        : "bg-input border-border text-text-secondary"
                    }`}
                  >
                    {index < currentStep ? <CheckCircle2 size={16} /> : index + 1}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-2 font-semibold text-text-secondary hidden sm:block">
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-1 bg-border rounded-full mx-2 hidden sm:block">
                    <div
                      className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${
                        index < currentStep ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(processForm)} className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col gap-4 min-h-[300px]">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <>
                <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-primary font-bold text-sm">
                  <Building2 size={18} />
                  <span>1. Basic Restaurant Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Restaurant Name *
                    </label>
                    <input
                      {...register("restaurantName")}
                      placeholder="e.g. Royal Spice Bistro"
                      className={`w-full rounded-xl border bg-input p-2.5 text-xs text-text-primary focus:outline-none ${
                        errors.restaurantName ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.restaurantName && (
                      <p className="mt-1 text-[10px] text-red-500">{errors.restaurantName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Tagline / Motto
                    </label>
                    <input
                      {...register("tagline")}
                      placeholder="e.g. Fine Dining & Royal Mughlai Cuisine"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Cuisines Offered (comma separated) *
                    </label>
                    <input
                      {...register("cuisineTypes")}
                      placeholder="North Indian, Chinese, Biryani"
                      className={`w-full rounded-xl border bg-input p-2.5 text-xs text-text-primary focus:outline-none ${
                        errors.cuisineTypes ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.cuisineTypes && (
                      <p className="mt-1 text-[10px] text-red-500">{errors.cuisineTypes.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Average Cost for Two (₹) *
                    </label>
                    <input
                      type="number"
                      {...register("costForTwo")}
                      placeholder="1000"
                      className={`w-full rounded-xl border bg-input p-2.5 text-xs text-text-primary focus:outline-none ${
                        errors.costForTwo ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.costForTwo && (
                      <p className="mt-1 text-[10px] text-red-500">{errors.costForTwo.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 1 && (
              <>
                <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-primary font-bold text-sm">
                  <MapPin size={18} />
                  <span>2. Location & Address Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      City *
                    </label>
                    <select
                      {...register("city")}
                      className={`w-full rounded-xl border bg-input p-2.5 text-xs text-text-primary focus:outline-none ${
                        errors.city ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Goa">Goa</option>
                      <option value="Jaipur">Jaipur</option>
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-[10px] text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Landmark
                    </label>
                    <input
                      {...register("landmark")}
                      placeholder="e.g. Near Metro Station"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      Pincode
                    </label>
                    <input
                      {...register("pincode")}
                      placeholder="560038"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                    Full Physical Address *
                  </label>
                  <textarea
                    rows={3}
                    {...register("address")}
                    placeholder="100 Feet Road, Indiranagar, Bengaluru"
                    className={`w-full rounded-xl border bg-input p-2.5 text-xs text-text-primary focus:outline-none ${
                      errors.address ? "border-red-500" : "border-border focus:border-primary"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-[10px] text-red-500">{errors.address.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Legal & Credentials */}
            {currentStep === 2 && (
              <>
                <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-primary font-bold text-sm">
                  <FileCheck size={18} />
                  <span>3. Legal & Payment Credentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      FSSAI License Number
                    </label>
                    <input
                      {...register("fssaiNumber")}
                      placeholder="11223344556677"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      GSTIN Number
                    </label>
                    <input
                      {...register("gstinNumber")}
                      placeholder="29AAAAA0000A1Z5"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold text-text-secondary">
                      UPI VPA ID
                    </label>
                    <input
                      {...register("upiVpa")}
                      placeholder="restaurant@upi"
                      className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 font-bold text-sm transition-all border ${
                currentStep === 0
                  ? "bg-input/50 text-text-secondary border-border/50 cursor-not-allowed opacity-50"
                  : "bg-card text-text-primary border-border hover:bg-input active:scale-95 shadow-sm"
              }`}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 px-6 font-black text-sm text-white shadow-xl hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Application…</span>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 px-6 font-black text-sm text-white shadow-xl hover:bg-primary-hover active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

