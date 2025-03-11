// Constants for Seven Pi Over Four Calendar
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const INTERCALARY_CYCLE = 7;
const INTERCALARY_MONTH_DAYS = 37;
const MICRO_YEAR_DAYS = 7;
const START_DATE = new Date(1913, 8, 15); // September 15, 1913 (JS months are zero-based)

function gregorianToSevenPiOverFour(gregorianDate) {
    const inputDate = new Date(gregorianDate);
    const deltaDays = Math.floor((inputDate - START_DATE) / (1000 * 60 * 60 * 24));

    // Determine how many full 7-year cycles have passed
    const cycleLength = (6 * (MONTHS_PER_YEAR * DAYS_PER_MONTH)) + (MONTHS_PER_YEAR * DAYS_PER_MONTH + INTERCALARY_MONTH_DAYS);
    const sevenYearCycles = Math.floor(deltaDays / cycleLength);

    // Calculate total intercalary days added
    const totalIntercalaryDays = sevenYearCycles * INTERCALARY_MONTH_DAYS;
    const adjustedDays = deltaDays + totalIntercalaryDays;

    // Determine the Seven Pi Over Four year
    const sevenPiYear = 1 + Math.floor(adjustedDays / (MONTHS_PER_YEAR * DAYS_PER_MONTH + (adjustedDays % cycleLength < 12 * DAYS_PER_MONTH ? 0 : INTERCALARY_MONTH_DAYS)));
    const daysIntoYear = adjustedDays % (MONTHS_PER_YEAR * DAYS_PER_MONTH + (sevenPiYear % INTERCALARY_CYCLE === 0 ? INTERCALARY_MONTH_DAYS : 0));

    // Determine if this is an intercalary year
    const isIntercalary = (sevenPiYear % INTERCALARY_CYCLE === 0);

    // Adjust for 13th Month in Intercalary Years
    let sevenPiMonth = Math.floor(daysIntoYear / DAYS_PER_MONTH) + 1;
    let sevenPiDay = (daysIntoYear % DAYS_PER_MONTH) + 1;

    if (isIntercalary && sevenPiMonth > 12) {
        sevenPiMonth = 13;
        sevenPiDay = daysIntoYear - (MONTHS_PER_YEAR * DAYS_PER_MONTH) + 1;
    }

    // Identify Micro Year (last 7 days of Month 13)
    let microYearDay = (isIntercalary && sevenPiMonth === 13 && sevenPiDay > (INTERCALARY_MONTH_DAYS - MICRO_YEAR_DAYS)) ? sevenPiDay : null;

    // Calculate week of the macro year
    const weekOfMacroYear = Math.floor(adjustedDays / DAYS_PER_WEEK) + 1;

    // Determine the day of the week (looping 1-7 continuously since start date)
    const dayOfWeek = (adjustedDays % DAYS_PER_WEEK) + 1;

    return {
        year: sevenPiYear,
        month: sevenPiMonth,
        day: sevenPiDay,
        week_of_macro_year: weekOfMacroYear,
        day_of_week: dayOfWeek,
        intercalary_year: isIntercalary,
        micro_year_day: microYearDay
    };
}

// Function to display today's Seven Pi Over Four date
function updateCurrentDate() {
    const today = new Date();
    const convertedDate = gregorianToSevenPiOverFour(today);
    console.log(`Today's Seven Pi Over Four Date: Year ${convertedDate.year}, Month ${convertedDate.month}, Day ${convertedDate.day}`);
}

// Function to convert an inputted Gregorian date
function convertDate(inputDate) {
    if (inputDate) {
        const convertedDate = gregorianToSevenPiOverFour(inputDate);
        console.log(`Converted Date: Year ${convertedDate.year}, Month ${convertedDate.month}, Day ${convertedDate.day}, 
            Week ${convertedDate.week_of_macro_year}, Day of Week ${convertedDate.day_of_week}`);

        if (convertedDate.intercalary_year) {
            console.log(`Intercalary Year: Yes`);
            if (convertedDate.micro_year_day !== null) {
                console.log(`Micro Year Day: ${convertedDate.micro_year_day}`);
            }
        }
    } else {
        console.log("Invalid date. Please enter a valid Gregorian date.");
    }
}

// Auto-run today's date conversion
updateCurrentDate();
