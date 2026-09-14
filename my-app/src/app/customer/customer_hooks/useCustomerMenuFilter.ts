import { useState, useMemo } from "react";
import type { AppMenuItem } from "@/types/appTypes";
import type { CustomerDietaryFilter } from "@/app/customer/customer_types/CustomerTypes";

export const DIETARY_TABS: { label: string; value: CustomerDietaryFilter }[] = [
  { label: "All Items", value: "ALL" },
  { label: "Veg ", value: "VEG" },
  { label: "Non-Veg ", value: "NON_VEG" },
  { label: "Jain ", value: "JAIN" },
];

const NON_VEG_KEYWORDS = ["chicken", "mutton", "fish", "prawn", "egg", "meat", "tikka masala non-veg"] as const;
const JAIN_SAFE_KEYWORDS = [
  "jain", "veg", "paneer", "dal", "roti", "naan", "rice", "lassi",
  "chai", "soda", "coffee", "gulab", "rasgulla", "kulfi", "brownie",
] as const;

export function isNonVeg(item: AppMenuItem): boolean {
  const lower = item.name.toLowerCase();
  return NON_VEG_KEYWORDS.some((kw) => lower.includes(kw));
}

export function isJainSafe(item: AppMenuItem): boolean {
  const lower = item.name.toLowerCase();
  if (isNonVeg(item)) return false;
  return JAIN_SAFE_KEYWORDS.some((kw) => lower.includes(kw));
}

function matchesDietaryFilter(item: AppMenuItem, filter: CustomerDietaryFilter): boolean {
  if (filter === "ALL") return true;
  if (filter === "NON_VEG") return isNonVeg(item);
  if (filter === "VEG") return !isNonVeg(item);
  if (filter === "JAIN") return isJainSafe(item);
  return true;
}

export function useCustomerMenuFilter(menuItems: AppMenuItem[], itemsPerPage: number = 8) {
  const [search, setSearch] = useState<string>("");
  const [dietaryFilter, setDietaryFilter] = useState<CustomerDietaryFilter>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categoriesList = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((i) => i.category)));
    return ["ALL", ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesSearch = query === "" || item.name.toLowerCase().includes(query);
      const matchesDietary = matchesDietaryFilter(item, dietaryFilter);
      const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
      return matchesSearch && matchesDietary && matchesCat;
    });
  }, [menuItems, search, dietaryFilter, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearch("");
    setDietaryFilter("ALL");
    setSelectedCategory("ALL");
    setCurrentPage(1);
  };

  const setCategoryAndResetPage = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const setDietaryAndResetPage = (filter: CustomerDietaryFilter) => {
    setDietaryFilter(filter);
    setCurrentPage(1);
  };

  const setSearchAndResetPage = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  return {
    search,
    setSearch: setSearchAndResetPage,
    dietaryFilter,
    setDietaryFilter: setDietaryAndResetPage,
    selectedCategory,
    setSelectedCategory: setCategoryAndResetPage,
    currentPage,
    setCurrentPage,
    categoriesList,
    filteredItems,
    paginatedItems,
    totalPages,
    resetFilters,
  };
}
