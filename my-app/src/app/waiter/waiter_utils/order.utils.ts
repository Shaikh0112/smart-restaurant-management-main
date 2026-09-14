// RESPONSIBILITY: Pure utility functions for orders and KOTs.

export function getStationForCategory(category: string): string {
  const stationMap: Record<string, string> = {
    "Starters": "Hot Kitchen",
    "Mains": "Hot Kitchen",
    "Desserts": "Cold Kitchen",
    "Beverages": "Bar",
  };
  return stationMap[category] || "General Kitchen";
}

export function calculateKotTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
