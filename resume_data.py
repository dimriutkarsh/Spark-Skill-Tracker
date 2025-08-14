import re
from datetime import datetime

class ResumeProcessor:
    def __init__(self):
        self.ats_keywords = {
            'technical': ['Python', 'JavaScript', 'HTML', 'CSS', 'React', 'Flask', 'SQL', 'Git', 'API', 'Machine Learning', 'Data Analysis'],
            'soft_skills': ['Leadership', 'Communication', 'Problem-solving', 'Teamwork', 'Analytical', 'Creative', 'Adaptable'],
            'action_words': ['Developed', 'Implemented', 'Designed', 'Managed', 'Led', 'Created', 'Optimized', 'Built', 'Analyzed', 'Improved']
        }
    
    def process_resume_data(self, form_data):
        """Process and enhance resume data for ATS optimization"""
        processed = form_data.copy()
        
        # Clean and format data
        processed['skills'] = self.format_skills(form_data.get('skills', ''))
        processed['education'] = self.clean_list_data(form_data.get('education', []))
        processed['experience'] = self.clean_list_data(form_data.get('experience', []))
        processed['projects'] = self.clean_list_data(form_data.get('projects', []))
        processed['certifications'] = self.format_text(form_data.get('certifications', ''))
        processed['achievements'] = self.format_text(form_data.get('achievements', ''))
        
        # Handle new array format for certifications and achievements
        if isinstance(form_data.get('certifications'), list):
            processed['certifications'] = self.clean_list_data(form_data.get('certifications', []))
        if isinstance(form_data.get('achievements'), list):
            processed['achievements'] = self.clean_list_data(form_data.get('achievements', []))
            
        processed['languages'] = self.format_skills(form_data.get('languages', ''))
        processed['objective'] = self.enhance_objective(form_data.get('objective', ''))
        
        # Add suggestions for improvement
        processed['suggestions'] = self.get_ats_suggestions(form_data)
        
        return processed
    
    def format_skills(self, skills_text):
        """Format skills for ATS optimization"""
        if not skills_text:
            return []
        
        skills = [skill.strip() for skill in skills_text.split(',')]
        return [skill for skill in skills if skill]
    
    def clean_list_data(self, data_list):
        """Clean and filter list data"""
        if not data_list:
            return []
        return [item.strip() for item in data_list if item.strip()]
    
    def format_text(self, text):
        """Format text fields"""
        if not text:
            return []
        
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        return lines
    
    def enhance_objective(self, objective):
        """Enhance objective statement with ATS-friendly language"""
        if not objective:
            return "Results-driven professional seeking to leverage technical expertise and problem-solving skills in a challenging role to drive innovation and deliver exceptional results."
        
        # Enhance with action words if needed
        enhanced = objective.strip()
        if not any(word in enhanced.lower() for word in ['seeking', 'looking', 'aiming', 'dedicated', 'motivated', 'passionate']):
            enhanced = "Motivated " + enhanced.lower()
        
        return enhanced
    
    def get_ats_suggestions(self, form_data):
        """Provide ATS optimization suggestions"""
        suggestions = []
        
        # Check for action words in experience
        experience_text = ' '.join(form_data.get('experience', []))
        if not any(word in experience_text for word in self.ats_keywords['action_words']):
            suggestions.append("Add action words like 'Developed', 'Implemented', 'Led' to your experience descriptions")
        
        # Check for technical skills
        skills_text = form_data.get('skills', '')
        if len(skills_text.split(',')) < 5:
            suggestions.append("Consider adding more relevant technical skills to improve ATS matching")
        
        # Check for quantifiable achievements
        if not any(char.isdigit() for char in experience_text):
            suggestions.append("Include quantifiable achievements (e.g., 'Improved efficiency by 25%')")
        
        # Check for contact information completeness
        if not form_data.get('linkedin'):
            suggestions.append("Add your LinkedIn profile URL for better professional visibility")
        
        return suggestions