from datetime import datetime, timedelta

def calculate_hos_plan(start_location, end_location, total_distance_miles, current_drive_hours=0, current_duty_hours=0):
    """
    HOS Calculation Engine based on FMCSA regulations:
    - 11-Hour Driving Limit
    - 14-Hour On-Duty Window
    - Mandatory 30-Minute Break after 8 hours of cumulative driving
    - 10-Hour Sleeper Berth / Off-Duty Period
    - Average Truck Speed: 55 mph
    - Refueling Stop: Every 1,000 miles
    """
    
    AVERAGE_SPEED = 55.0  # mph
    MAX_DRIVE_BEFORE_BREAK = 8.0  # hours
    BREAK_DURATION = 0.5  # hours (30 mins)
    MAX_DRIVE_PER_DAY = 11.0  # hours
    MAX_DUTY_PER_DAY = 14.0  # hours
    MANDATORY_REST_DURATION = 10.0  # hours
    FUEL_INTERVAL_MILES = 1000.0  # miles
    FUEL_STOP_DURATION = 1.0  # hours
    
    total_driving_time_needed = total_distance_miles / AVERAGE_SPEED
    
    remaining_drive = total_driving_time_needed
    current_day_drive = current_drive_hours
    current_day_duty = current_duty_hours
    drive_since_last_break = current_drive_hours
    distance_since_last_fuel = 0.0
    
    schedule = []
    current_time = datetime.now()
    
    schedule.append({
        "event": "Start Trip",
        "time": current_time.strftime("%Y-%m-%d %H:%M"),
        "details": f"Departure from {start_location}"
    })
    
    while remaining_drive > 0:
        # Determine maximum drive time before any required stop
        drive_chunk = min(
            remaining_drive,
            MAX_DRIVE_BEFORE_BREAK - drive_since_last_break,
            MAX_DRIVE_PER_DAY - current_day_drive,
            MAX_DUTY_PER_DAY - current_day_duty
        )
        
        if drive_chunk <= 0:
            # Reached daily limit -> 10-hour mandatory rest period
            current_time += timedelta(hours=MANDATORY_REST_DURATION)
            schedule.append({
                "event": "10-Hour Mandatory Rest",
                "time": current_time.strftime("%Y-%m-%d %H:%M"),
                "details": "Rest Period (Sleeper Berth) to reset HOS clocks"
            })
            current_day_drive = 0
            current_day_duty = 0
            drive_since_last_break = 0
            continue
            
        # Drive calculated chunk
        remaining_drive -= drive_chunk
        current_day_drive += drive_chunk
        current_day_duty += drive_chunk
        drive_since_last_break += drive_chunk
        distance_since_last_fuel += drive_chunk * AVERAGE_SPEED
        current_time += timedelta(hours=drive_chunk)
        
        # Check refueling requirement
        if distance_since_last_fuel >= FUEL_INTERVAL_MILES and remaining_drive > 0:
            current_time += timedelta(hours=FUEL_STOP_DURATION)
            current_day_duty += FUEL_STOP_DURATION
            distance_since_last_fuel = 0
            schedule.append({
                "event": "Fueling Stop",
                "time": current_time.strftime("%Y-%m-%d %H:%M"),
                "details": "1-Hour Fuel Stop & Vehicle Inspection"
            })
            
        # Check mandatory 30-minute break requirement
        if drive_since_last_break >= MAX_DRIVE_BEFORE_BREAK and remaining_drive > 0:
            current_time += timedelta(hours=BREAK_DURATION)
            current_day_duty += BREAK_DURATION
            drive_since_last_break = 0
            schedule.append({
                "event": "30-Minute Break",
                "time": current_time.strftime("%Y-%m-%d %H:%M"),
                "details": "Mandatory 30-minute rest break after 8 hours of driving"
            })
            
    schedule.append({
        "event": "Arrive at Destination",
        "time": current_time.strftime("%Y-%m-%d %H:%M"),
        "details": f"Arrival at {end_location}"
    })
    
    total_trip_hours = (current_time - datetime.now()).total_seconds() / 3600
    
    return {
        "start_location": start_location,
        "end_location": end_location,
        "total_distance_miles": total_distance_miles,
        "estimated_driving_hours": round(total_driving_time_needed, 2),
        "total_trip_duration_hours": round(total_trip_hours, 2),
        "schedule": schedule
    }