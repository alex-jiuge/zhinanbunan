export function calculateCurrentAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

export function checkAgeUpdate(storedAge: number, birthYear: number): { needsUpdate: boolean; newAge: number } {
  const currentAge = calculateCurrentAge(birthYear);
  return {
    needsUpdate: currentAge !== storedAge,
    newAge: currentAge,
  };
}
