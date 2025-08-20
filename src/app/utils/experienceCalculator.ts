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
      const [startStr, endStr] = period.split(' – ');
      
      const startDate = parseDate(startStr);
      const endDate = endStr === 'Present' ? currentDate : parseDate(endStr);
      
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
  const [month, year] = dateStr.split(' ');
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  return new Date(parseInt(year), monthIndex);
}
