from flask import Flask, render_template, jsonify, request, session, send_file, redirect, url_for
import random, string
import os
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from attendance_utils import *
from resume_generator import ResumeGenerator
from ai_processor import AIProcessor
from openai_client import GeminiClient
from career_advisor import CareerAdvisor

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
# Sample attendance data
# -------------------------
def get_attendance_data():
    return {
        'current_semester': 2,
        'subjects': {
            'Mathematics-II': {
                'total_classes': 45,
                'attended_classes': 38,
                'percentage': 84.4,
                'instructor': 'Dr. Sharma'
            },
            'Data Structures': {
                'total_classes': 42,
                'attended_classes': 30,
                'percentage': 71.4,
                'instructor': 'Prof. Kumar'
            },
            'Digital Logic': {
                'total_classes': 40,
                'attended_classes': 36,
                'percentage': 90.0,
                'instructor': 'Dr. Singh'
            },
            'Environmental Science': {
                'total_classes': 35,
                'attended_classes': 33,
                'percentage': 94.3,
                'instructor': 'Prof. Gupta'
            },
            'Workshop Practice': {
                'total_classes': 30,
                'attended_classes': 28,
                'percentage': 93.3,
                'instructor': 'Mr. Verma'
            },
            'Technical Writing': {
                'total_classes': 25,
                'attended_classes': 18,
                'percentage': 72.0,
                'instructor': 'Ms. Rani'
            }
        },
        'attendance_history': [
            {'date': '2024-01-15', 'subject': 'Mathematics-II', 'status': 'Present'},
            {'date': '2024-01-15', 'subject': 'Data Structures', 'status': 'Absent'},
            {'date': '2024-01-14', 'subject': 'Digital Logic', 'status': 'Present'},
            {'date': '2024-01-14', 'subject': 'Environmental Science', 'status': 'Present'},
            {'date': '2024-01-13', 'subject': 'Workshop Practice', 'status': 'Present'},
            {'date': '2024-01-13', 'subject': 'Technical Writing', 'status': 'Absent'},
            {'date': '2024-01-12', 'subject': 'Mathematics-II', 'status': 'Present'},
            {'date': '2024-01-12', 'subject': 'Data Structures', 'status': 'Present'},
        ]
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
# NEW ATTENDANCE ROUTES
# -------------------------
@app.route("/attendance")
def attendance_dashboard():
    student_data = get_student_data()
    attendance_data = get_attendance_data()
    
    # Calculate metrics
    metrics = calculate_attendance_metrics(attendance_data['subjects'])
    
    # Get recommendations
    recommendations = get_subject_recommendations(attendance_data['subjects'])
    
    # Calculate detailed info for each subject
    subject_details = {}
    for subject_name, data in attendance_data['subjects'].items():
        classes_needed = calculate_classes_needed(data['total_classes'], data['attended_classes'])
        holidays_available = calculate_holidays_available(data['total_classes'], data['attended_classes'])
        status = get_attendance_status(data['percentage'])
        
        subject_details[subject_name] = {
            **data,
            'classes_needed': classes_needed,
            'holidays_available': holidays_available,
            'status': status
        }
    
    return render_template("attendance_dashboard.html",
                           student=student_data,
                           attendance=attendance_data,
                           metrics=metrics,
                           subject_details=subject_details,
                           recommendations=recommendations)


@app.route("/api/calculate_attendance", methods=['POST'])
def api_calculate_attendance():
    try:
        data = request.json
        total_classes = int(data.get('total_classes', 0))
        attended_classes = int(data.get('attended_classes', 0))
        target_percentage = float(data.get('target_percentage', 75))
        
        if total_classes <= 0:
            return jsonify({'error': 'Total classes must be greater than zero'}), 400
        
        if attended_classes < 0:
            return jsonify({'error': 'Attended classes cannot be negative'}), 400
            
        if attended_classes > total_classes:
            return jsonify({'error': 'Attended classes cannot be more than total classes'}), 400
        
        current_percentage = (attended_classes / total_classes) * 100
        classes_needed = calculate_classes_needed(total_classes, attended_classes, target_percentage)
        holidays_available = calculate_holidays_available(total_classes, attended_classes, target_percentage)
        status = get_attendance_status(current_percentage)
        
        # Calculate weekly projections
        weekly_data = calculate_weekly_projections(total_classes, attended_classes, target_percentage)
        
        # Get detailed recommendations
        detailed_recommendations = get_detailed_recommendations(current_percentage, classes_needed, holidays_available, target_percentage)
        
        return jsonify({
            'current_percentage': round(current_percentage, 2),
            'classes_needed': classes_needed,
            'holidays_available': holidays_available,
            'status': status,
            'target_percentage': target_percentage,
            'weekly_data': weekly_data,
            'recommendations': detailed_recommendations
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid input values. Please enter valid numbers.'}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred while calculating attendance.'}), 500


@app.route("/api/update_attendance", methods=['POST'])
def api_update_attendance():
    data = request.json
    subject = data.get('subject')
    action = data.get('action')  # 'add_present' or 'add_absent'
    
    # In a real app, you would update the database here
    # For now, just return success
    return jsonify({'success': True, 'message': f'Attendance updated for {subject}'})

# -------------------------
# resume builder
# -------------------------


# Initialize AI components
resume_gen = ResumeGenerator()
ai_processor = AIProcessor()

@app.route("/resume-builder")
def generateresume():
    return render_template("resume.html")

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.get_json()
        
        # Process data with AI
        processed_data = ai_processor.enhance_resume_data(data)
        
        # Generate resume
        resume_path = resume_gen.create_resume(processed_data)
        
        return jsonify({
            'success': True,
            'message': 'Resume generated successfully!',
            'download_url': f'/download/{os.path.basename(resume_path)}'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating resume: {str(e)}'
        }), 500

@app.route('/api/enhance-description', methods=['POST'])
def enhance_description():
    try:
        data = request.get_json()
        description = data.get('description', '')
        job_type = data.get('type', 'experience')
        
        enhanced = ai_processor.enhance_description(description, job_type)
        
        return jsonify({
            'success': True,
            'enhanced_description': enhanced
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error enhancing description: {str(e)}'
        }), 500

@app.route('/download/<filename>')
def download_file(filename):
    try:
        return send_file(
            os.path.join('generated_resumes', filename),
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    # Create directories if they don't exist
    os.makedirs('generated_resumes', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)


# -------------------------
# Personalized agent
# -------------------------


# Initialize Gemini client
try:
    gemini_client = GeminiClient()
    career_advisor = CareerAdvisor(gemini_client)
    print("Gemini client initialized successfully")
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    gemini_client = None
    career_advisor = None

@app.route('/ai-agent')
def index():
    session.clear()
    return render_template('ai-agent.html')

@app.route('/chatbot')
def chatbot():
    if 'quiz_completed' not in session:
        return redirect(url_for('index'))
    return render_template('chatbot.html', student_data=session.get('student_data'))

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    try:
        if not career_advisor:
            return jsonify({'success': False, 'error': 'AI service not available'})
        
        data = request.json
        question_id = data.get('question_id')
        answer = data.get('answer')

        if 'answers' not in session:
            session['answers'] = {}
        session['answers'][question_id] = answer
        session.modified = True

        questions = ['name', 'semester', 'field', 'skills', 'goals']
        current_index = questions.index(question_id)

        if current_index < len(questions) - 1:
            next_question_id = questions[current_index + 1]
            return jsonify({'success': True, 'next_question': next_question_id, 'is_last': False})
        else:
            student_data = session['answers']
            session['student_data'] = student_data
            session['quiz_completed'] = True
            session.modified = True
            return jsonify({'success': True, 'quiz_complete': True, 'redirect_url': url_for('chatbot')})

    except Exception as e:
        print(f"Error in submit_answer: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_roadmap', methods=['POST'])
def get_roadmap():
    try:
        if not career_advisor:
            return jsonify({'success': False, 'error': 'AI service not available'})
        if 'student_data' not in session:
            return jsonify({'success': False, 'error': 'No student data found'})

        student_data = session['student_data']
        print(f"Generating roadmap for: {student_data.get('name', 'Unknown')}")
        roadmap = career_advisor.generate_roadmap(student_data)

        return jsonify({'success': True, 'roadmap': roadmap})
    except Exception as e:
        print(f"Error in get_roadmap: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_reality_check', methods=['POST'])
def get_reality_check():
    try:
        if not career_advisor:
            return jsonify({'success': False, 'error': 'AI service not available'})
        if 'student_data' not in session:
            return jsonify({'success': False, 'error': 'No student data found'})

        student_data = session['student_data']
        print(f"Generating reality check for: {student_data.get('name', 'Unknown')}")
        reality_check = career_advisor.generate_reality_check(student_data)

        return jsonify({'success': True, 'reality_check': reality_check})
    except Exception as e:
        print(f"Error in get_reality_check: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/chat_message', methods=['POST'])
def chat_message():
    try:
        if not career_advisor:
            return jsonify({'success': False, 'error': 'AI service not available'})

        data = request.json
        message = data.get('message')
        if 'student_data' not in session:
            return jsonify({'success': False, 'error': 'No student data found'})

        student_data = session['student_data']
        print(f"Processing chat message: {message[:50]}...")
        response = career_advisor.chat_with_student(message, student_data)

        return jsonify({'success': True, 'response': response})
    except Exception as e:
        print(f"Error in chat_message: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/update_progress', methods=['POST'])
def update_progress():
    try:
        data = request.json
        progress_data = data.get('progress')

        if 'progress_tracking' not in session:
            session['progress_tracking'] = {}
        session['progress_tracking'].update(progress_data)
        session.modified = True

        return jsonify({'success': True})
    except Exception as e:
        print(f"Error in update_progress: {e}")
        return jsonify({'success': False, 'error': str(e)})


# -------------------------
# Run app
# -------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)


