import smtplib
from email.message import EmailMessage

# Your email credentials (use environment variables for security in a production setting)
email_address = "your_email@gmail.com"
email_password = "your_app_password"  # If using Gmail, generate an app password from your Google account

# List of emails (this would be your scraped list)
email_list = ['email1@example.com', 'email2@example.com', 'email3@example.com']

# Function to send email
def send_email_to_list(subject, content, email_list):
    # Create the email message
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = email_address
    msg.set_content(content)
    
    # Establish connection to the email server
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(email_address, email_password)
        
        for email in email_list:
            msg['To'] = email
            smtp.send_message(msg)
            print(f"Email sent to {email}")
    
# Define your email content
subject = "Broadcast Email"
content = """
Hello,

This is a test broadcast email sent to all recipients.

Best regards,
Your Name
"""

# Send the email
send_email_to_list(subject, content, email_list)
