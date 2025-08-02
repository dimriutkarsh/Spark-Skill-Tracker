import os
from datetime import datetime
from fpdf import FPDF

class ResumeGenerator:
    def __init__(self):
        self.setup_colors()
    
    def setup_colors(self):
        """Setup color scheme to match the professional resume"""
        self.primary_color = (0, 43, 92)  # Dark blue
        self.accent_color = (242, 177, 0)  # Gold/yellow
        self.text_color = (51, 51, 51)     # Dark gray
        self.light_gray = (128, 128, 128)  # Light gray
        self.skill_colors = [
            (52, 152, 219),   # Blue
            (46, 204, 113),   # Green  
            (155, 89, 182),   # Purple
            (241, 196, 15),   # Yellow
            (231, 76, 60),    # Red
            (26, 188, 156)    # Teal
        ]
    
    def create_resume(self, data):
        """Generate a PDF resume matching the professional layout"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        name = data.get('personal_info', {}).get('full_name', 'user').replace(' ', '_')
        filename = f"resume_{name}_{timestamp}.pdf"
        filepath = os.path.join('generated_resumes', filename)
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Add header section
        self._add_header(pdf, data.get('personal_info', {}))
        
        # Add main content in two columns
        self._add_main_content(pdf, data)
        
        pdf.output(filepath)
        return filepath
    
    def _add_header(self, pdf, personal_info):
        """Add header with name, title, and contact info"""
        pdf.set_fill_color(*self.primary_color)
        pdf.rect(0, 0, 210, 50, 'F')
        
        # Add name
        pdf.set_font('Arial', 'B', 24)
        pdf.set_text_color(255, 255, 255)
        pdf.set_xy(20, 15)
        name = personal_info.get('full_name', 'Your Name').upper()
        pdf.cell(0, 10, name, 0, 1)
        
        # Add title/position (derive from summary or first job)
        pdf.set_font('Arial', '', 12)
        pdf.set_xy(20, 28)
        title = self._extract_title(personal_info)
        pdf.cell(0, 8, title, 0, 1)
        
        # Contact info line
        pdf.set_font('Arial', '', 9)
        pdf.set_xy(20, 38)
        contact_parts = []
        if personal_info.get('email'):
            contact_parts.append(personal_info['email'])
        if personal_info.get('phone'):
            contact_parts.append(personal_info['phone'])
        if personal_info.get('location'):
            contact_parts.append(personal_info['location'])
        
        contact_text = ' | '.join(contact_parts)
        pdf.cell(0, 6, contact_text, 0, 1)
        
        pdf.ln(15)
    
    def _extract_title(self, personal_info):
        """Extract or generate a professional title"""
        summary = personal_info.get('summary', '')
        if 'developer' in summary.lower():
            return 'SOFTWARE DEVELOPER'
        elif 'engineer' in summary.lower():
            return 'SOFTWARE ENGINEER'
        elif 'analyst' in summary.lower():
            return 'DATA ANALYST'
        elif 'manager' in summary.lower():
            return 'PROJECT MANAGER'
        else:
            return 'PROFESSIONAL'
    
    def _add_main_content(self, pdf, data):
        """Add main content in structured layout"""
        current_y = pdf.get_y()
        
        # Left column
        self._add_left_column(pdf, data, current_y)
        
        # Right column
        self._add_right_column(pdf, data, current_y)
    
    def _add_left_column(self, pdf, data, start_y):
        """Add left column content (About, Experience, Education)"""
        pdf.set_xy(15, start_y)
        
        # About section
        if data.get('personal_info', {}).get('summary'):
            self._add_section_header(pdf, 'ABOUT')
            pdf.set_font('Arial', '', 9)
            pdf.set_text_color(*self.text_color)
            summary = data['personal_info']['summary']
            pdf.set_xy(15, pdf.get_y() + 2)
            pdf.multi_cell(90, 4, summary)
            pdf.ln(5)
        
        # Experience section
        if data.get('experience'):
            self._add_section_header(pdf, 'EXPERIENCE')
            for exp in data['experience']:
                self._add_experience_item(pdf, exp)
            pdf.ln(3)
        
        # Education section
        if data.get('education'):
            self._add_section_header(pdf, 'EDUCATION')
            for edu in data['education']:
                self._add_education_item(pdf, edu)
    
    def _add_right_column(self, pdf, data, start_y):
        """Add right column content (Skills, Projects, etc.)"""
        right_x = 115
        pdf.set_xy(right_x, start_y)
        
        # Skills section
        if data.get('skills'):
            self._add_section_header_right(pdf, 'SKILLS', right_x)
            self._add_skills_section(pdf, data['skills'], right_x)
            pdf.ln(5)
        
        # Projects section
        if data.get('projects'):
            current_y = pdf.get_y()
            pdf.set_xy(right_x, current_y)
            self._add_section_header_right(pdf, 'PROJECTS', right_x)
            for project in data['projects']:
                self._add_project_item(pdf, project, right_x)
    
    def _add_section_header(self, pdf, title):
        """Add section header for left column"""
        pdf.set_font('Arial', 'B', 11)
        pdf.set_text_color(*self.primary_color)
        pdf.set_xy(15, pdf.get_y() + 3)
        pdf.cell(0, 6, title, 0, 1)
        
        # Add underline
        pdf.set_draw_color(*self.primary_color)
        pdf.line(15, pdf.get_y() - 1, 50, pdf.get_y() - 1)
        pdf.ln(2)
    
    def _add_section_header_right(self, pdf, title, x):
        """Add section header for right column"""
        pdf.set_font('Arial', 'B', 11)
        pdf.set_text_color(*self.primary_color)
        current_y = pdf.get_y()
        pdf.set_xy(x, current_y + 3)
        pdf.cell(0, 6, title, 0, 1)
        
        # Add underline
        pdf.set_draw_color(*self.primary_color)
        pdf.line(x, pdf.get_y() - 1, x + 35, pdf.get_y() - 1)
        pdf.ln(2)
    
    def _add_experience_item(self, pdf, exp):
        """Add experience item"""
        # Company and title
        pdf.set_font('Arial', 'B', 10)
        pdf.set_text_color(*self.text_color)
        pdf.set_xy(15, pdf.get_y() + 2)
        
        company = exp.get('company', 'Company')
        title = exp.get('job_title', 'Position')
        pdf.cell(0, 5, f"{company} - {title}", 0, 1)
        
        # Date
        pdf.set_font('Arial', 'I', 8)
        pdf.set_text_color(*self.light_gray)
        pdf.set_xy(15, pdf.get_y())
        start_date = exp.get('start_date', '')
        end_date = exp.get('end_date', 'Present') if not exp.get('current_job') else 'Present'
        if start_date:
            pdf.cell(0, 4, f"{start_date} - {end_date}", 0, 1)
        
        # Description
        if exp.get('job_description'):
            pdf.set_font('Arial', '', 8)
            pdf.set_text_color(*self.text_color)
            pdf.set_xy(15, pdf.get_y() + 1)
            
            # Split into bullet points
            descriptions = exp['job_description'].split('\n')
            for desc in descriptions[:3]:  # Limit to 3 bullet points
                if desc.strip():
                    pdf.set_xy(15, pdf.get_y())
                    pdf.cell(3, 3, '•', 0, 0)
                    pdf.set_xy(20, pdf.get_y())
                    pdf.multi_cell(85, 3, desc.strip()[:80] + ('...' if len(desc.strip()) > 80 else ''))
        
        pdf.ln(3)
    
    def _add_education_item(self, pdf, edu):
        """Add education item"""
        pdf.set_font('Arial', 'B', 10)
        pdf.set_text_color(*self.text_color)
        pdf.set_xy(15, pdf.get_y() + 2)
        
        degree = edu.get('degree', 'Degree')
        field = edu.get('field_of_study', '')
        if field:
            degree_text = f"{degree} in {field}"
        else:
            degree_text = degree
        
        pdf.cell(0, 5, degree_text, 0, 1)
        
        # Institution and year
        pdf.set_font('Arial', '', 9)
        pdf.set_xy(15, pdf.get_y())
        institution = edu.get('institution', 'Institution')
        year = edu.get('graduation_year', '')
        info_text = f"{institution}"
        if year:
            info_text += f" | {year}"
        
        pdf.cell(0, 4, info_text, 0, 1)
        pdf.ln(2)
    
    def _add_skills_section(self, pdf, skills, x):
        """Add skills as colored tags"""
        current_y = pdf.get_y()
        
        # Technical Skills
        if skills.get('technical'):
            pdf.set_xy(x, current_y)
            self._add_skill_tags(pdf, skills['technical'], x, 'Technical')
            current_y = pdf.get_y() + 5
        
        # Soft Skills  
        if skills.get('soft'):
            pdf.set_xy(x, current_y)
            self._add_skill_tags(pdf, skills['soft'], x, 'Soft Skills')
            current_y = pdf.get_y() + 5
        
        # Languages
        if skills.get('languages'):
            pdf.set_xy(x, current_y)
            self._add_skill_tags(pdf, skills['languages'], x, 'Languages')
    
    def _add_skill_tags(self, pdf, skill_list, x, category):
        """Add skills as colored rectangular tags"""
        pdf.set_font('Arial', 'B', 8)
        pdf.set_text_color(*self.text_color)
        pdf.cell(0, 4, category + ':', 0, 1)
        
        current_y = pdf.get_y() + 2
        current_x = x
        max_width = 80
        
        for i, skill in enumerate(skill_list[:6]):  # Limit to 6 skills per category
            color = self.skill_colors[i % len(self.skill_colors)]
            
            # Calculate text width
            pdf.set_font('Arial', '', 7)
            text_width = pdf.get_string_width(skill) + 4
            
            # Check if we need to wrap to next line
            if current_x + text_width > x + max_width:
                current_y += 8
                current_x = x
            
            # Draw skill tag
            pdf.set_fill_color(*color)
            pdf.set_text_color(255, 255, 255)
            pdf.set_xy(current_x, current_y)
            pdf.cell(text_width, 6, skill, 0, 0, 'C', True)
            
            current_x += text_width + 3
        
        pdf.set_xy(x, current_y + 8)
    
    def _add_project_item(self, pdf, project, x):
        """Add project item"""
        pdf.set_font('Arial', 'B', 9)
        pdf.set_text_color(*self.text_color)
        current_y = pdf.get_y() + 2
        pdf.set_xy(x, current_y)
        
        project_name = project.get('name', 'Project')
        pdf.cell(0, 5, project_name, 0, 1)
        
        # Technologies
        if project.get('technologies'):
            pdf.set_font('Arial', 'I', 7)
            pdf.set_text_color(*self.light_gray)
            pdf.set_xy(x, pdf.get_y())
            tech_text = ', '.join(project['technologies'][:4])  # Limit technologies
            pdf.cell(0, 3, tech_text, 0, 1)
        
        # Description
        if project.get('description'):
            pdf.set_font('Arial', '', 8)
            pdf.set_text_color(*self.text_color)
            pdf.set_xy(x, pdf.get_y() + 1)
            description = project['description'][:100] + ('...' if len(project['description']) > 100 else '')
            pdf.multi_cell(80, 3, description)
        
        pdf.ln(3)