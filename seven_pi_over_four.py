from datetime import datetime, timedelta
import json

# Constants
DAYS_PER_WEEK = 7
DAYS_PER_MONTH = 30  # Regular months
MONTHS_PER_YEAR = 12  # Regular years
INTERCALARY_CYCLE = 7  # Every 7 years, a 13th month is added
INTERCALARY_MONTH_DAYS = 37  # The 13th month in leap years
MICRO_YEAR_DAYS = 7  # Last 7 days of 13th month in leap years
START_DATE = datetime(1913, 9, 15)  # Day 1 of the Seven Pi Over Four system

def gregorian_to_seven_pi_over_four(gregorian_date):
    """Convert a Gregorian date to the Seven Pi Over Four calendar."""
    
    # Ensure input is a datetime object
    if isinstance(gregorian_date, str):
        gregorian_date = datetime.strptime(gregorian_date, "%Y-%m-%d")

    # Calculate total days since the start date
    total_days = (gregorian_date - START_DATE).days

    # Determine how many full 7-year cycles have passed
    cycle_length = (6 * (MONTHS_PER_YEAR * DAYS_PER_MONTH)) + (MONTHS_PER_YEAR * DAYS_PER_MONTH + INTERCALARY_MONTH_DAYS)
    seven_year_cycles = total_days // cycle_length

    # Calculate total intercalary days added
    total_intercalary_days = seven_year_cycles * INTERCALARY_MONTH_DAYS

    # Adjust total days with intercalary corrections
    adjusted_days = total_days + total_intercalary_days

    # Determine the Seven Pi Over Four year
    seven_pi_year = 1 + adjusted_days // (MONTHS_PER_YEAR * DAYS_PER_MONTH + (INTERCALARY_MONTH_DAYS if ((adjusted_days // (MONTHS_PER_YEAR * DAYS_PER_MONTH)) % INTERCALARY_CYCLE == 0) else 0))
    days_into_year = adjusted_days % (MONTHS_PER_YEAR * DAYS_PER_MONTH + (INTERCALARY_MONTH_DAYS if seven_pi_year % INTERCALARY_CYCLE == 0 else 0))

    # Determine if this is an intercalary year
    is_intercalary = (seven_pi_year % INTERCALARY_CYCLE == 0)

    # Adjust for 13th Month in Intercalary Years
    seven_pi_month = (days_into_year // DAYS_PER_MONTH) + 1
    seven_pi_day = (days_into_year % DAYS_PER_MONTH) + 1

    if is_intercalary and seven_pi_month > 12:
        seven_pi_month = 13
        seven_pi_day = days_into_year - (MONTHS_PER_YEAR * DAYS_PER_MONTH) + 1

    # Identify Micro Year (last 7 days of Month 13)
    micro_year_day = seven_pi_day if (is_intercalary and seven_pi_month == 13 and seven_pi_day > (INTERCALARY_MONTH_DAYS - MICRO_YEAR_DAYS)) else None

    # Calculate week of the macro year
    week_of_macro_year = (adjusted_days // DAYS_PER_WEEK) + 1

    # Determine the day of the week (looping 1-7 continuously since 1913-09-15 was Day 1)
    day_of_week = (adjusted_days % DAYS_PER_WEEK) + 1

    return {
        "year": seven_pi_year,
        "month": seven_pi_month,
        "day": seven_pi_day,
        "week_of_macro_year": week_of_macro_year,
        "day_of_week": day_of_week,
        "intercalary_year": is_intercalary,
        "micro_year_day": micro_year_day  # Will only have a value in the last 7 days of an intercalary year
    }

# TEST: Run conversion for multiple dates to verify accuracy
test_dates = ["2025-03-10", "1991-12-25", "2000-01-01", "2013-09-15", "1913-09-15", "2030-12-25", "2035-07-01", "2042-09-15"]
converted_results = {date: gregorian_to_seven_pi_over_four(date) for date in test_dates}

# Print results
print(json.dumps(converted_results, indent=4))
