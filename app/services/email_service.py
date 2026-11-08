import os
import resend
from dotenv import load_dotenv

load_dotenv()
resend.api_key = os.environ.get('RESEND_API_KEY')

def enviar_notificacion(nombre : str, email_destino : str, match_score : int):
    if match_score >= 85:
        asunto = "Has avanzado a la siguiente fase de entrevistas!"
        cuerpo_html = f"""
        <h2>Hola {nombre},</h2>
        <p>Hemos revisado tu perfil y nos impresiona tu experiencia. Tu nivel de compatibilidad con nuestra vacante es del <strong>{match_score}%</strong>.</p>
        <p>Nos encantaría agendar una entrevista técnica contigo la próxima semana. Pronto te enviaremos el enlace a nuestro calendario.</p>
        <p>Saludos,<br>El equipo de Adquisición de Talento.</p>
        """
    elif match_score < 50:
        asunto = "Actualización sobre tu candidatura"
        cuerpo_html = f"""
        <h2>Hola {nombre},</h2>
        <p>Agradecemos el tiempo que tomaste para aplicar. En este momento, estamos buscando un perfil con un enfoque ligeramente distinto (Match actual: {match_score}%).</p>
        <p>Conservaremos tu CV en nuestra base de talentos para futuras oportunidades que se alineen mejor con tus habilidades.</p>
        <p>Éxito en tu búsqueda,<br>El equipo de Adquisición de Talento.</p>
        """
    else:
        print(f"Candidato {nombre} en zona gris ({match_score}%). Requiere revisión manual.")
        return

    #Envio del correo
    try:
        r = resend.Emails.send({
            'from' : 'Smart ATS <onboarding@resend.dev>',
            'to' : email_destino,
            'subject' : asunto,
            'html' : cuerpo_html
        })
        print(f'Correo enviado exitosamente a {nombre} {email_destino}')
    except Exception as e:
        print(f'Error al enviar correo a {email_destino}: {str(e)}')