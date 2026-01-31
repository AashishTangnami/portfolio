export async function calculateTotalExperience(): Promise<number> {
  try {
    const response = await fetch('/api/json/experience.json');
    const data = await response.json();
    
    if (!data || !Array.isArray(data.experience)) {
      return 5; // fallback value
    }

    let totalMonths = 0;
    const currentDate = new Date();

    data.experience.forEach((exp: any) => {
      const period = exp.period;
      if (!period) return;
      
      // Handle both " – " (en-dash) and " - " (hyphen) separators
      const separator = period.includes(' – ') ? ' – ' : ' - ';
      const [startStr, endStr] = period.split(separator);
      
      if (!startStr || !endStr) return;
      
      const startDate = parseDate(startStr.trim());
      const endDate = (endStr.trim() === 'Present' || endStr.trim() === 'Now') ? currentDate : parseDate(endStr.trim());
      
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    });

    return Math.ceil(totalMonths / 12);
  } catch (error) {
    console.error('Error calculating experience:', error);
    return 5; // fallback value
  }
}

function parseDate(dateStr: string): Date {
  // Remove commas and extra spaces
  const cleaned = dateStr.replace(/,/g, '').trim();
  const [month, year] = cleaned.split(' ');
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  return new Date(parseInt(year), monthIndex);
}
