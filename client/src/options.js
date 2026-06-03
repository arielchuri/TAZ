// Pre-populated catalog of pickable items, grouped by category.
// Single source of truth for the Give/Take chip picker — fully offline,
// no fetch. The same catalog serves both offers (Give) and needs (Take).

export const CATALOG = [
  { category: "Tools", items: ["Ladder", "Drill", "Hand saw", "Wheelbarrow"] },
  { category: "Food", items: ["Fresh bread", "Vegetables", "Drinking water"] },
  { category: "Skills", items: ["Plumbing", "First aid", "Bike repair", "Cooking"] },
  { category: "Transport", items: ["Car ride", "Cargo bike", "Moving help"] },
  { category: "Shelter", items: ["Spare room", "Tent space", "Charging spot"] },
  { category: "Care", items: ["Childcare", "Elder check-in", "Pet sitting"] },
];
