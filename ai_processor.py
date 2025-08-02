from resume_generator import ResumeGenerator
import re


class AIProcessor:
    """Simplified AI processor for resume enhancement"""
    
    def __init__(self):
        self.action_verbs = [
            'Achieved', 'Built', 'Created', 'Developed', 'Enhanced', 'Implemented',
            'Improved', 'Led', 'Managed', 'Optimized', 'Delivered', 'Executed'
        ]
        
        self.technical_skills = [
            'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
            'Java', 'C++', 'Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL'
        ]
        
        self.soft_skills = [
            'Leadership', 'Communication', 'Problem Solving', 'Team Work',
            'Project Management', 'Critical Thinking', 'Time Management'
        ]
    
    def enhance_resume_data(self, data):
        """Enhance the entire resume data"""
        enhanced_data = data.copy()
        
        # Enhance personal summary
        if 'personal_info' in enhanced_data and 'summary' in enhanced_data['personal_info']:
            enhanced_data['personal_info']['summary'] = self.enhance_summary(
                enhanced_data['personal_info']['summary']
            )
        
        # Enhance work experience
        if 'experience' in enhanced_data:
            for i, exp in enumerate(enhanced_data['experience']):
                if 'job_description' in exp:
                    enhanced_data['experience'][i]['job_description'] = self.enhance_description(
                        exp['job_description'], 'experience'
                    )
        
        # Enhance projects
        if 'projects' in enhanced_data:
            for i, project in enumerate(enhanced_data['projects']):
                if 'description' in project:
                    enhanced_data['projects'][i]['description'] = self.enhance_description(
                        project['description'], 'project'
                    )
        
        return enhanced_data
    
    def enhance_description(self, description, content_type='experience'):
        """Enhance descriptions with better formatting"""
        if not description or not description.strip():
            return description
        
        sentences = [s.strip() for s in description.split('\n') if s.strip()]
        enhanced_sentences = []
        
        for sentence in sentences:
            enhanced = self._improve_sentence(sentence, content_type)
            enhanced_sentences.append(enhanced)
        
        return '\n'.join(enhanced_sentences)
    
    def _improve_sentence(self, sentence, content_type):
        """Improve individual sentences"""
        sentence = sentence.strip()
        if not sentence:
            return sentence
        
        # Remove existing bullet points
        sentence = re.sub(r'^[•\-\*]\s*', '', sentence)
        
        # Add action verb if needed
        words = sentence.split()
        if words and not any(sentence.lower().startswith(verb.lower()) for verb in self.action_verbs):
            if content_type == 'experience':
                if 'develop' in sentence.lower():
                    sentence = f"Developed {sentence.lower()}"
                elif 'manage' in sentence.lower():
                    sentence = f"Managed {sentence.lower()}"
                elif 'create' in sentence.lower():
                    sentence = f"Created {sentence.lower()}"
                else:
                    sentence = f"Executed {sentence.lower()}"
            else:  # project
                sentence = f"Built {sentence.lower()}"
        
        # Capitalize and add period
        sentence = sentence[0].upper() + sentence[1:] if len(sentence) > 1 else sentence.upper()
        if not sentence.endswith('.'):
            sentence += '.'
        
        return sentence
    
    def enhance_summary(self, summary):
        """Enhance professional summary"""
        if not summary or not summary.strip():
            return summary
        
        enhanced = summary.strip()
        
        # Ensure strong opening
        strong_openings = ['experienced', 'skilled', 'dedicated', 'results-driven', 'passionate']
        if not any(enhanced.lower().startswith(phrase) for phrase in strong_openings):
            enhanced = f"Experienced professional with {enhanced.lower()}"
        
        # Capitalize first letter
        enhanced = enhanced[0].upper() + enhanced[1:] if len(enhanced) > 1 else enhanced.upper()
        
        return enhanced