export const CELL_SIZE = 50

export enum CellType {
  Ground, // Sol

  Grass, // Herbe (bloquant : impossible de marcher dessus)
  Fence, // Barrière (bloquant)

  SpadeDeactivated, // Pique avant que l'on marche dessus (actif)
  SpadeActivated,   // Pique après avoir marché dessus (mortel)

  ConveyorBeltUp,    // Tapis roulant vers le haut
  ConveyorBeltDown,  // Tapis roulant vers le bas
  ConveyorBeltRight, // Tapis roulant vers la droite
  ConveyorBeltLeft,  // Tapis roulant vers la gauche

  TurnstileUpRight,   // Tourniquet (haut/droite)
  TurnstileUpLeft,    // Tourniquet (haut/gauche)
  TurnstileDownRight, // Tourniquet (bas/droite)
  TurnstileDownLeft,  // Tourniquet (bas/gauche)

  Start, // Balise de début de niveau
  End,   // Balise de fin de niveau

  Carrot,     // Carotte à manger
  CarrotHole, // Trou de carotte (s'affiche après avoir mangé la carotte)
}

export function nextState(cellType: CellType): CellType {
  switch (cellType) {
    case CellType.SpadeDeactivated:
      return CellType.SpadeActivated

    case CellType.TurnstileUpRight:
      return CellType.TurnstileDownRight

    case CellType.TurnstileUpLeft:
      return CellType.TurnstileUpRight

    case CellType.TurnstileDownRight:
      return CellType.TurnstileDownLeft

    case CellType.TurnstileDownLeft:
      return CellType.TurnstileUpLeft

    default:
      return cellType
  }
}

export function isSolid(cellType: CellType): boolean {
  switch (cellType) {
    case CellType.Grass:
    case CellType.Fence:
      return true

    default:
      return false
  }
}

export const cells: { [key: number]: CellType } = {
  1: CellType.Ground,

  2: CellType.Grass,
  3: CellType.Fence,

  4: CellType.SpadeDeactivated,
  5: CellType.SpadeActivated,

  6: CellType.ConveyorBeltUp,
  7: CellType.ConveyorBeltDown,
  8: CellType.ConveyorBeltRight,
  9: CellType.ConveyorBeltLeft,

  10: CellType.TurnstileUpRight,
  11: CellType.TurnstileUpLeft,
  12: CellType.TurnstileDownRight,
  13: CellType.TurnstileDownLeft,

  14: CellType.Start,
  15: CellType.End,

  16: CellType.Carrot,
  17: CellType.CarrotHole,
}
