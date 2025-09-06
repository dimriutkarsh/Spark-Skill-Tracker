from openai_client import GeminiClient
from typing import Dict, Any

class CareerAdvisor:
    def __init__(self, openai_client: GeminiClient):
        self.client = openai_client
    
    def generate_roadmap(self, student_data: Dict[str, Any]) -> str:
        """Generate a comprehensive career roadmap"""
        
        semester = student_data.get('semester', 'Not specified')
        field = student_data.get('field', 'Not specified')
        skills = student_data.get('skills', 'Not specified')
        goals = student_data.get('goals', 'Not specified')
        name = student_data.get('name', 'Student')
        
        prompt = f"""
        Create a detailed career roadmap for {name} based on the following information:
        
        Current Semester: {semester}
        Field of Interest: {field}
        Current Skills: {skills}
        Career Goals: {goals}
        
        Please provide a comprehensive roadmap that includes:

        U have to answer each and every points in just one or two lines thats it no need to give full brief explanations
        
        1. revision of the skills he/she have(if they have any skills / if not then ignore it):
        2. a list of courses he/she should take (if they have any skills / if not then ignore it):
        3. a list of projects he/she should work on (if they have any skills / if not then ignore it):

        4.if he has not done anythingy yet then a proper flowchart of how he can start from scratch.
        5.which skill he/she have to focus aaccording to their interest
        6. how he/she can get a job in the field of interest
        
        Format the response with clear sections and actionable items. Be specific and practical.

        you donot need to give response in exact order be simple and short and to the point and answer in minimum to minimum words required
        """
        
        return self.client.generate_structured_response(prompt, student_data, max_tokens=1500)
    
    def generate_reality_check(self, student_data: Dict[str, Any]) -> str:
        """Generate honest reality check and advice"""
        
        semester = student_data.get('semester', 'Not specified')
        field = student_data.get('field', 'Not specified')
        skills = student_data.get('skills', 'Not specified')
        goals = student_data.get('goals', 'Not specified')
        name = student_data.get('name', 'Student')
        
        # Skip reality check for complete beginners
        if semester in ['1', '2', 'First Year', '1st', '2nd']:
            prompt = f"""
            firstly u have to respond in hinglish language just like a normal person conversation and answer all the questions in hinglish too

            Provide encouraging guidance for {name} who is just starting their journey:
            
            Field of Interest: {field}
            Current Skills: {skills}
            Career Goals: {goals}
            
            Since {name} is in the early stages, focus on:
            1. **Motivation and Encouragement**
            2. **Foundation Building Tips**
            3. **Common Beginner Mistakes to Avoid**
            4. **Early Career Exploration Advice**
            5. **Building Good Study Habits**
            
            Be supportive and focus on growth mindset rather than current limitations amd also be specific about your points.explain all things in under 200 words maximum straight to the point
            """
        else:
            prompt = f"""
            firstly u have to respond in hinglish language just like a normal person conversation and answer all the questions in hinglish too

            I don't want you to act like a yes-man. I don't want you to always agree with me or sugarcoat things. Instead, I want you to be completely honest, direct, and raw with me. Challenge my opinions and call out my mistakes, flaws in logic, or unrealistic thinking. Don't worry about hurting my feelings - I value truth and growth over comfort. Avoid empty compliments or generic motivational fluff; focus on real, actionable, and evidence-backed advice. Think like a tough coach or a brutally honest friend who cares more about my improvement than my short-term comfort. Always push back when needed, and never bullshit me. Please confirm you understand and will stick to this approach throughout our entire conversation, no matter the topic

            Provide an brutally honest, constructive reality check for {name} based on their current situation and roast them so that they will be on right track:
            .
            you donot have to give answer in exact order be simple and short and to the point and answer in minimum to minimum words required so that the student which is there to understand about his/her current situation and how he/she can improve
            Current Semester: {semester}
            Field of Interest: {field}
            Current Skills: {skills}
            Career Goals: {goals}
            
            Please provide:

            1.
            -did he start early enough?
            -is he on the right path?
            -do you think he is even serious or jocking about his goals?
            
            2.
            -comparison to other people of same age and semester where do he stand
            
            3.
            -is the field he chose still in demand?
            -is his skills enough to get intership and later job
            
            
            Be honest but constructive. Focus on growth and improvement rather than just criticism.

            you donot need to give response in exact order be simple and short and to the point and answer in minimum to minimum words required.

            also hash and brutually honest towards him so that he can have a real reality check and will improve in his life and your whole response should be in hinglish
            """
        
        return self.client.generate_structured_response(prompt, student_data, max_tokens=1300)
    
    def chat_with_student(self, message: str, student_data: Dict[str, Any]) -> str:
        """Handle general chat with context awareness"""
        
        context_prompt = f"""
        You are chatting with a student. Here's their context:
        
        Name: {student_data.get('name', 'Student')}
        Semester: {student_data.get('semester', 'Not specified')}
        Field: {student_data.get('field', 'Not specified')}
        Skills: {student_data.get('skills', 'Not specified')}
        Goals: {student_data.get('goals', 'Not specified')}
        
        Student's message: {message}
        
        Provide helpful, personalized advice based on their context. Be conversational but professional.
        """
        
        return self.client.generate_structured_response(context_prompt, student_data, max_tokens=800)
    
    def generate_progress_tracker(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate progress tracking structure"""
        
        # This would typically create a structured progress tracking system
        # For now, return a basic structure
        return {
            'technical_skills': [],
            'projects_completed': [],
            'courses_taken': [],
            'networking_activities': [],
            'certifications': [],
            'internships': [],
            'milestones_achieved': []
        }