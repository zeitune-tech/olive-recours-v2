export interface FeeRequest {
  rate: number; // Taux en pourcentage (ex. : 3 pour 3%)
  startDate: string; // Date au format ISO (ex. : "2025-01-01")
}

export interface FeeResponse {
  id: number;
  rate: number; // Taux en pourcentage
  startDate: string; // Date de début
  endDate?: string; // Date de fin (optionnel)
}