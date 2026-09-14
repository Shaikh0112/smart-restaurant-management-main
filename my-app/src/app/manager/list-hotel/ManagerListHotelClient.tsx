// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { getStoredTenants, saveTenants } from "@/lib/tenantService";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import { dispatchNotification } from "@/lib/notificationService";
import type { AppTenant, AppTenantSpecialItem } from "@/types/appTypes";

import { CoreDetails } from "./manager_list_hotel_components/CoreDetails";
import { AboutAmenities } from "./manager_list_hotel_components/AboutAmenities";
import { VisualGallery } from "./manager_list_hotel_components/VisualGallery";
import { SpecialOffersAndSpecialties } from "./manager_list_hotel_components/SpecialOffersAndSpecialties";
import { FeaturedItems } from "./manager_list_hotel_components/FeaturedItems";

export default function ManagerListHotelClient() {
  const { currentUser } = useAuth();
  const [activeTenant, setActiveTenant] = useState<AppTenant | null>(null);
  
  const [descriptionInput, setDescriptionInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [offersInput, setOffersInput] = useState("");
  const [featuredItems, setFeaturedItems] = useState<AppTenantSpecialItem[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const all = getStoredTenants();
    let myTenant = all.find(t => t.ownerId === currentUser.id);
    if (!myTenant && currentUser.role === "ADMIN") {
      const activeTid = typeof window !== "undefined" ? localStorage.getItem("active_tenant_id") : null;
      myTenant = all.find(t => t.tenantId === activeTid) || all[0];
    }
    if (myTenant) {
      setActiveTenant(myTenant);
      setDescriptionInput(myTenant.description || "");
      const defaultGalleryArray = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80"
      ];
      
      const existingGallery = myTenant.galleryUrls || [];
      const combinedGallery = Array.from(new Set([...existingGallery, ...defaultGalleryArray]));
      
      setGalleryInput(combinedGallery.join(",\n"));
      setAmenitiesInput(myTenant.amenities?.join(", ") || "Free WiFi, AC, Parking, Premium Dining, Valet, Live Music");
      setSpecialtiesInput(myTenant.specialties?.join(", ") || "Signature Biryani, Paneer Tikka, Dal Makhani");
      setOffersInput(myTenant.offers?.join(", ") || "20% off on all main courses, Free welcome drink for couples");
      
      const defaultFeatured = [
        {
          name: "Royal Chicken Biryani",
          description: "Slow-cooked authentic basmati rice with tender marinated chicken.",
          imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Paneer Butter Masala",
          description: "Rich and creamy tomato gravy with soft cottage cheese cubes.",
          imageUrl: "https://images.unsplash.com/photo-1551881192-002d02cb12d9?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Sizzling Brownie",
          description: "Hot chocolate brownie served with cold vanilla ice cream.",
          imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Tandoori Platter",
          description: "Assorted kebabs and tikkas fresh from the tandoor.",
          imageUrl: "https://images.unsplash.com/photo-1599487405270-8e7d23d85bc2?auto=format&fit=crop&w=800&q=80"
        }
      ];

      setFeaturedItems(myTenant.featuredItems && myTenant.featuredItems.length > 0 ? 
        // If they have existing items, just keep them, but if they only have the previous 2, let's merge.
        (myTenant.featuredItems.length < 4 ? [...myTenant.featuredItems, ...defaultFeatured.slice(myTenant.featuredItems.length)] : myTenant.featuredItems) 
        : defaultFeatured
      );
    }
  }, [currentUser]);

  const handleSave = () => {
    if (!activeTenant) return;
    setIsSaving(true);

    const all = getStoredTenants();
    const updated = all.map(t => {
      if (t.tenantId === activeTenant.tenantId) {
        return {
          ...t,
          description: descriptionInput,
          galleryUrls: galleryInput.split(",").map(s => s.trim()).filter(Boolean),
          amenities: amenitiesInput.split(",").map(s => s.trim()).filter(Boolean),
          specialties: specialtiesInput.split(",").map(s => s.trim()).filter(Boolean),
          offers: offersInput.split(",").map(s => s.trim()).filter(Boolean),
          featuredItems: featuredItems,
          isListed: true,
        };
      }
      return t;
    });

    saveTenants(updated);
    
    dispatchNotification({
      role: "MANAGER",
      type: "GENERIC_INFO",
      title: "Listing Updated 🌟",
      message: "Your hotel profile has been enriched and is live on the marketplace! 🚀",
      route: "/admin/list-hotel",
      playSound: true,
      soundType: "READY",
    });

    setTimeout(() => setIsSaving(false), 600);
  };

  const addFeaturedItem = () => {
    setFeaturedItems([...featuredItems, { name: "", description: "", imageUrl: "" }]);
  };

  const updateFeaturedItem = (index: number, field: keyof AppTenantSpecialItem, value: string) => {
    const updated = [...featuredItems];
    updated[index] = { ...updated[index], [field]: value };
    setFeaturedItems(updated);
  };

  const removeFeaturedItem = (index: number) => {
    setFeaturedItems(featuredItems.filter((_, i) => i !== index));
  };

  if (!activeTenant) {
    return <div className="p-8 text-center text-text-secondary">Loading profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 text-text-primary">Enrich Hotel Profile</h1>
          <p className="body text-text-secondary mt-1">Add rich details to impress your customers on the marketplace.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          <span>{isSaving ? "Saving..." : "Publish & Save"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Info & General Description */}
        <div className="lg:col-span-1 space-y-8">
          <CoreDetails activeTenant={activeTenant} />

          <AboutAmenities 
            descriptionInput={descriptionInput}
            setDescriptionInput={setDescriptionInput}
            amenitiesInput={amenitiesInput}
            setAmenitiesInput={setAmenitiesInput}
          />
        </div>

        {/* Right Column: Visuals & Offers */}
        <div className="lg:col-span-2 space-y-8">
          
          <VisualGallery 
            galleryInput={galleryInput}
            setGalleryInput={setGalleryInput}
          />

          <SpecialOffersAndSpecialties 
            offersInput={offersInput}
            setOffersInput={setOffersInput}
            specialtiesInput={specialtiesInput}
            setSpecialtiesInput={setSpecialtiesInput}
          />

          <FeaturedItems 
            featuredItems={featuredItems}
            addFeaturedItem={addFeaturedItem}
            updateFeaturedItem={updateFeaturedItem}
            removeFeaturedItem={removeFeaturedItem}
          />

        </div>
      </div>
    </div>
  );
}
