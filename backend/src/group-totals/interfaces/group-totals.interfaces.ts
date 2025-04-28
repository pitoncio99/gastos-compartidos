export interface GroupTotals {
    groupId: string;
    nombre : string;
    totals: Record<string, number>; // Objeto con los totales de las deudas por persona
    createdAt: Date;
  }
  