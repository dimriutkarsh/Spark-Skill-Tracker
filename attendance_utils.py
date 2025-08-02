import math
from datetime import datetime, timedelta

def calculate_attendance_metrics(subjects_data):
    """Calculate attendance metrics for all subjects"""
    total_classes = 0
    total_attended = 0
    
    for subject in subjects_data.values():
        total_classes += subject['total_classes']
        total_attended += subject['attended_classes']
    
    overall_percentage = (total_attended / total_classes * 100) if total_classes > 0 else 0
    
    return {
        'total_classes': total_classes,
        'total_attended': total_attended, 
        'overall_percentage': round(overall_percentage, 2)
    }

def calculate_classes_needed(total_classes, attended_classes, target_percentage=75):
    """Calculate how many classes needed to reach target percentage"""
    if total_classes == 0:
        return 0
    
    current_percentage = (attended_classes / total_classes) * 100
    
    if current_percentage >= target_percentage:
        return 0
    
    # Calculate classes needed using formula: 
    # (attended + x) / (total + x) = target/100
    # Solving for x: x = (target * total - 100 * attended) / (100 - target)
    
    if target_percentage >= 100:
        return float('inf')  # Impossible to reach 100% if already missed classes
    
    classes_needed = (target_percentage * total_classes - 100 * attended_classes) / (100 - target_percentage)
    return max(0, math.ceil(classes_needed))  # Round up to next whole number

def calculate_holidays_available(total_classes, attended_classes, target_percentage=75):
    """Calculate how many classes can be missed while staying above target"""
    if total_classes == 0:
        return 0
    
    current_percentage = (attended_classes / total_classes) * 100
    
    if current_percentage < target_percentage:
        return 0
    
    if target_percentage <= 0:
        return float('inf')  # Can miss unlimited classes if target is 0
    
    # Calculate maximum total classes while maintaining target percentage
    # attended / (total + x) >= target/100
    # Solving for maximum x: x = (100 * attended / target) - total
    
    max_total_classes = math.floor(100 * attended_classes / target_percentage)
    holidays_available = max(0, max_total_classes - total_classes)
    
    return holidays_available

def get_attendance_status(percentage):
    """Get status and color based on attendance percentage"""
    if percentage >= 90:
        return {'status': 'excellent', 'color': '#228B22', 'text': 'Excellent'}
    elif percentage >= 80:
        return {'status': 'good', 'color': '#32CD32', 'text': 'Good'}
    elif percentage >= 75:
        return {'status': 'average', 'color': '#FFD700', 'text': 'Satisfactory'}
    else:
        return {'status': 'poor', 'color': '#FF4500', 'text': 'Poor'}

def get_subject_recommendations(subjects_data):
    """Generate recommendations based on subject attendance"""
    recommendations = []
    critical_subjects = []
    good_subjects = []
    
    for subject_name, data in subjects_data.items():
        percentage = data['percentage']
        
        if percentage < 75:
            critical_subjects.append({
                'name': subject_name,
                'percentage': percentage,
                'classes_needed': calculate_classes_needed(
                    data['total_classes'], 
                    data['attended_classes']
                )
            })
        elif percentage >= 85:
            good_subjects.append(subject_name)
    
    if critical_subjects:
        recommendations.append("🚨 Critical: Focus on improving attendance in subjects below 75%")
        for subject in critical_subjects:
            recommendations.append(f"📚 {subject['name']}: Need {subject['classes_needed']} more classes to reach 75%")
    
    if good_subjects:
        recommendations.append(f"✅ Excellent attendance in: {', '.join(good_subjects[:3])}")
    
    if not critical_subjects:
        recommendations.append("🎉 Great job! All subjects meet the minimum attendance requirement")
    
    return recommendations

def calculate_weekly_projections(total_classes, attended_classes, target_percentage=75):
    """Calculate weekly schedule projections based on Mon-Fri, 8 classes per day"""
    classes_per_day = 8
    working_days_per_week = 5
    classes_per_week = classes_per_day * working_days_per_week  # 40 classes per week
    
    current_percentage = (attended_classes / total_classes * 100) if total_classes > 0 else 0
    classes_needed = calculate_classes_needed(total_classes, attended_classes, target_percentage)
    holidays_available = calculate_holidays_available(total_classes, attended_classes, target_percentage)
    
    # Calculate weeks needed to reach target
    weeks_needed = math.ceil(classes_needed / classes_per_week) if classes_needed > 0 else 0
    
    # Calculate days that can be missed
    days_can_miss = holidays_available // classes_per_day if holidays_available > 0 else 0
    
    return {
        'classes_per_week': classes_per_week,
        'weeks_needed': weeks_needed,
        'days_can_miss': days_can_miss,
        'classes_per_day': classes_per_day,
        'working_days_per_week': working_days_per_week
    }

def get_detailed_recommendations(current_percentage, classes_needed, holidays_available, target_percentage):
    """Get detailed recommendations based on attendance status"""
    recommendations = []
    
    if current_percentage < target_percentage:
        # Below target - need improvement
        if classes_needed <= 10:
            recommendations.append(f"⚠️ You need {classes_needed} more classes to reach {target_percentage}%. Stay focused!")
        elif classes_needed <= 20:
            recommendations.append(f"🚨 Critical: You need {classes_needed} classes. Don't miss any more!")
        else:
            recommendations.append(f"🔴 Very Critical: You need {classes_needed} classes. Immediate action required!")
        
        # Weekly breakdown
        weekly_data = calculate_weekly_projections(0, 0, target_percentage)  # Just for structure
        if classes_needed > 0:
            weeks = math.ceil(classes_needed / 40)  # 40 classes per week
            recommendations.append(f"📅 At full attendance, you'll reach target in ~{weeks} week(s)")
            
        recommendations.append("💡 Tips: Don't miss any classes, attend extra sessions if available")
        
    else:
        # Above target - doing well
        recommendations.append(f"✅ Great! You're {current_percentage - target_percentage:.1f}% above the minimum requirement")
        
        if holidays_available > 0:
            days_off = holidays_available // 8  # 8 classes per day
            recommendations.append(f"🏖️ You can miss up to {holidays_available} classes ({days_off} full days)")
            
        if current_percentage >= 90:
            recommendations.append("🏆 Excellent attendance! Keep up the great work!")
        elif current_percentage >= 85:
            recommendations.append("👍 Very good attendance! You're doing well!")
        
        recommendations.append("📊 Monitor your attendance regularly to maintain this performance")
    
    # Add semester-end projection
    if current_percentage < target_percentage:
        recommendations.append("📈 Focus on consistent attendance for the rest of the semester")
    else:
        recommendations.append("🎯 You're on track for excellent semester attendance!")
    
    return recommendations

def calculate_semester_projection(total_classes, attended_classes, estimated_remaining_classes):
    """Calculate end-of-semester attendance projection"""
    if estimated_remaining_classes <= 0:
        return (attended_classes / total_classes * 100) if total_classes > 0 else 0
    
    # Assume perfect attendance for remaining classes
    future_total = total_classes + estimated_remaining_classes
    future_attended = attended_classes + estimated_remaining_classes
    
    projected_percentage = (future_attended / future_total * 100)
    
    return {
        'projected_percentage': round(projected_percentage, 2),
        'remaining_classes': estimated_remaining_classes,
        'future_total': future_total,
        'future_attended': future_attended
    }

def get_attendance_insights(subjects_data):
    """Generate detailed insights about attendance patterns"""
    insights = []
    total_subjects = len(subjects_data)
    excellent_count = 0
    good_count = 0
    satisfactory_count = 0
    poor_count = 0
    
    for subject_name, data in subjects_data.items():
        percentage = data['percentage']
        if percentage >= 90:
            excellent_count += 1
        elif percentage >= 80:
            good_count += 1
        elif percentage >= 75:
            satisfactory_count += 1
        else:
            poor_count += 1
    
    # Overall performance insight
    if poor_count == 0:
        insights.append("🎉 All subjects meet the minimum 75% requirement!")
    else:
        insights.append(f"⚠️ {poor_count} out of {total_subjects} subjects below 75% requirement")
    
    # Best performing subjects
    if excellent_count > 0:
        insights.append(f"🏆 {excellent_count} subject(s) with excellent attendance (≥90%)")
    
    # Improvement areas
    if poor_count > 0:
        insights.append(f"🎯 Focus on improving {poor_count} critical subject(s)")
    
    return insights