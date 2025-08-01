from flask import Flask, render_template, jsonify, request, session, send_file, redirect, url_for
import random, string
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import base64

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for sessions


# -------------------------
# Sample student data
# -------------------------
def get_student_data():
    return {
        'name': 'UTKARSH DIMRI',
        'roll_number': '240970170044',
        'college': 'THDC INSTITUTE OF HYDROPOWER ENGINEERING AND TECHNOLOGY',
        'course': 'B.TECH. (Computer Science & Engineering - AI & ML)',
        'year_of_admission': '2024',
        'course_duration': '4 Years',
        'current_progress': '1 Year'
    }


# -------------------------
# Sample academic data
# -------------------------
def get_academic_data():
    return {
        'semesters': [
            {
                'semester': 1,
                'subjects': [
                    {'name': 'Mathematics-I', 'credits': 4, 'grade': 'A', 'marks': 85},
                    {'name': 'Physics', 'credits': 3, 'grade': 'A+', 'marks': 92},
                    {'name': 'Chemistry', 'credits': 3, 'grade': 'B+', 'marks': 78},
                    {'name': 'Programming in C', 'credits': 4, 'grade': 'A', 'marks': 88},
                    {'name': 'Engineering Graphics', 'credits': 2, 'grade': 'A+', 'marks': 95},
                    {'name': 'Communication Skills', 'credits': 2, 'grade': 'B', 'marks': 75}
                ],
                'sgpa': 8.5,
                'attendance': 92
            },
            {
                'semester': 2,
                'subjects': [
                    {'name': 'Mathematics-II', 'credits': 4, 'grade': 'A+', 'marks': 90},
                    {'name': 'Data Structures', 'credits': 4, 'grade': 'A', 'marks': 87},
                    {'name': 'Digital Logic', 'credits': 3, 'grade': 'B+', 'marks': 80},
                    {'name': 'Environmental Science', 'credits': 2, 'grade': 'A', 'marks': 85},
                    {'name': 'Workshop Practice', 'credits': 2, 'grade': 'A+', 'marks': 93},
                    {'name': 'Technical Writing', 'credits': 2, 'grade': 'B+', 'marks': 79}
                ],
                'sgpa': 8.7,
                'attendance': 88
            }
        ],
        'cgpa': 8.6,
        'overall_attendance': 90
    }


# -------------------------
# Performance analysis
# -------------------------
def get_performance_analysis(academic_data):
    cgpa = academic_data['cgpa']
    attendance = academic_data['overall_attendance']

    if cgpa >= 9.0:
        cgpa_remark, cgpa_color = "Excellent", "#228B22"
    elif cgpa >= 8.0:
        cgpa_remark, cgpa_color = "Very Good", "#32CD32"
    elif cgpa >= 7.0:
        cgpa_remark, cgpa_color = "Good", "#FFD700"
    elif cgpa >= 6.0:
        cgpa_remark, cgpa_color = "Average", "#FFA500"
    else:
        cgpa_remark, cgpa_color = "Needs Improvement", "#FF4500"

    if attendance >= 90:
        attendance_remark, attendance_color = "Excellent", "#228B22"
    elif attendance >= 80:
        attendance_remark, attendance_color = "Good", "#32CD32"
    elif attendance >= 75:
        attendance_remark, attendance_color = "Satisfactory", "#FFD700"
    else:
        attendance_remark, attendance_color = "Poor", "#FF4500"

    improvements = []
    if cgpa < 8.0:
        improvements.extend([
            "Focus on understanding core concepts better",
            "Seek help from faculty during office hours"
        ])
    if attendance < 85:
        improvements.append("Improve class attendance to meet minimum requirements")
    if not improvements:
        improvements.extend([
            "Keep up the excellent work!",
            "Consider participating in research projects"
        ])

    return {
        'cgpa_remark': cgpa_remark,
        'cgpa_color': cgpa_color,
        'attendance_remark': attendance_remark,
        'attendance_color': attendance_color,
        'improvements': improvements
    }


# -------------------------
# Graph creation
# -------------------------
def create_performance_graphs(academic_data):
    plt.style.use('default')
    sns.set_palette("husl")

    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
    fig.patch.set_facecolor('#eaf3f3')

    semesters = [sem['semester'] for sem in academic_data['semesters']]
    sgpas = [sem['sgpa'] for sem in academic_data['semesters']]

    # SGPA Trend
    ax1.plot(semesters, sgpas, marker='o', linewidth=3, markersize=8, color='#002b5c')
    ax1.set_title('SGPA Trend', fontsize=14, fontweight='bold', color='#002b5c')
    ax1.set_ylim(0, 10)

    # Subject Performance (last semester)
    current_sem = academic_data['semesters'][-1]
    subjects = [sub['name'][:8] + '...' if len(sub['name']) > 8 else sub['name']
                for sub in current_sem['subjects']]
    marks = [sub['marks'] for sub in current_sem['subjects']]

    bars = ax2.bar(subjects, marks, color='#007f00', alpha=0.7)
    for bar, mark in zip(bars, marks):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                 str(mark), ha='center', va='bottom', fontweight='bold')

    # Attendance Trend
    attendance = [sem['attendance'] for sem in academic_data['semesters']]
    ax3.bar(semesters, attendance, color='#f2b100', alpha=0.8)
    ax3.axhline(y=75, color='red', linestyle='--', alpha=0.7)

    # Grade Distribution
    all_grades = []
    for sem in academic_data['semesters']:
        all_grades.extend([sub['grade'] for sub in sem['subjects']])
    grade_counts = pd.Series(all_grades).value_counts().sort_index()

    ax4.pie(grade_counts.values, labels=grade_counts.index, autopct='%1.1f%%')

    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100)
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode()
    plt.close()

    return img_base64


# -------------------------
# Routes
# -------------------------
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        userid = request.form.get('userid')
        password = request.form.get('password')
        user_captcha = request.form.get('captcha')
        real_captcha = session.get('captcha')

        if userid and password and user_captcha == real_captcha:
            return redirect(url_for('dashboard'))  # Goes to dashboard.html

        return "Invalid credentials or captcha!", 400
    return render_template('login.html')


@app.route('/captcha')
def captcha():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    session['captcha'] = code
    image = Image.new('RGB', (100, 40), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    draw.text((10, 5), code, fill=(0, 0, 0), font=font)

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return send_file(buffer, mimetype='image/png')


@app.route("/dashboard")
def dashboard():
    student_data = get_student_data()
    academic_data = get_academic_data()
    analysis = get_performance_analysis(academic_data)
    graph_data = create_performance_graphs(academic_data)
    return render_template("dashboard.html",
                           student=student_data,
                           academic=academic_data,
                           analysis=analysis,
                           graph=graph_data)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/spark-dashboard")
def spark_dashboard():
    student_data = get_student_data()
    academic_data = get_academic_data()
    analysis = get_performance_analysis(academic_data)
    graph_data = create_performance_graphs(academic_data)
    return render_template("spark-dashboard.html",
                           student=student_data,
                           academic=academic_data,
                           analysis=analysis,
                           graph=graph_data)


# -------------------------
# Run app
# -------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
