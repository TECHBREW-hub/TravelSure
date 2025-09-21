// Simple date formatting utility to replace date-fns
export function format(date: Date, formatStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (formatStr === 'MMM dd') {
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    return `${month} ${day}`;
  }
  
  // Default fallback
  return date.toLocaleDateString();
}