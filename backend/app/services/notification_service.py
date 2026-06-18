import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_email(subject: str, body: str, to_email: str) -> bool:
    """Send an email using SMTP."""
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print("SMTP not configured, skipping email")
        return False
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_contact_notification(name: str, email: str, phone: str, service: str, message: str) -> bool:
    """Send notification for new contact form submission."""
    subject = f"New Contact Form Submission - {name}"
    body = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Phone: {phone}
Service: {service}

Message:
{message}

---
Ruddhaa Architects & Interiors
    """
    
    # Send email to admin
    return send_email(subject, body, settings.ADMIN_EMAIL)


def send_whatsapp_message(phone: str, message: str) -> bool:
    """Send WhatsApp message (placeholder - requires API integration)."""
    # This is a placeholder for WhatsApp API integration
    # You can use services like:
    # - Twilio WhatsApp API
    # - WhatsApp Business API
    # - Third-party services like CallMeBot, etc.
    
    print(f"WhatsApp Message to {phone}: {message}")
    
    # Example using a service (you'll need to implement actual API call):
    # if settings.WHATSAPP_API_KEY:
    #     try:
    #         url = "https://api.whatsapp-service.com/send"
    #         payload = {
    #             "phone": phone,
    #             "message": message,
    #             "api_key": settings.WHATSAPP_API_KEY
    #         }
    #         response = requests.post(url, json=payload)
    #         return response.status_code == 200
    #     except Exception as e:
    #         print(f"Error sending WhatsApp: {e}")
    #         return False
    
    return True
