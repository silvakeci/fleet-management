export const MAKES = [
    "Ford",
    "Toyota",
    "Mercedes",
    "Volkswagen",
    "Renault",
    "Nissan",
  ] as const;
  
  export const MODELS: Record<(typeof MAKES)[number], string[]> = {
    Ford: ["Transit", "Ranger", "Focus"],
    Toyota: ["Camry", "Hilux", "Corolla"],
    Mercedes: ["Sprinter", "Vito"],
    Volkswagen: ["Transporter", "Caddy"],
    Renault: ["Trafic", "Kangoo"],
    Nissan: ["Navara", "NV200"],
  };
  
  export const COLORS = ["White", "Black", "Silver", "Blue", "Red", "Gray"] as const;
  