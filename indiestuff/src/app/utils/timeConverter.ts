export const getFormattedDurationFromSeconds = (durationInSec: number): string => {
    if (durationInSec > 3600) {
        return new Date(durationInSec * 1000).toISOString().substr(11, 8);
    } else {
        return new Date(durationInSec * 1000).toISOString().substr(14, 5);
    }
};

export const getMonthName = (month: number): string => {
   const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
   ]; 
   return months[month];
}
