# **App Name**: WhatsAutomator

## Core Features:

- CSV Upload: File upload area for the CSV file containing contact information (name, phone, group).
- Link Input: Input field for the user to enter the offer link.
- Message Automation: Process the CSV file and the link. Create personalized messages based on the data in the CSV file and the provided link. Automate sending these personalized messages via WhatsApp.
- Status Display: Display status messages to indicate successful message sends or errors.

## Style Guidelines:

- Primary color: White or light grey for a clean and professional look.
- Secondary color: A calm blue (#3498db) to instill trust.
- Accent color: Green (#2ecc71) for success messages and primary call-to-action buttons.
- Simple, single-column layout for easy navigation.
- Use clear and recognizable icons for file upload and status indicators.

## Original User Request:
tenho um scrip em python que coloco um arquivo csv e um link, ele envia mensagens autamaticas via whatsapp, preciso hospedar o script, e preciso de uma tela para subir o arquivo e digitar o link
esse e o script
import pandas as pd
import time
import webbrowser
import pyautogui
import urllib.parse
from datetime import datetime
import os

def log_message(message):
    """Registra mensagens de log com timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def send_whatsapp_message(phone, messages):
    """Envia uma lista de mensagens para um número de WhatsApp"""
    # Formata o número de telefone (remove caracteres não numéricos)
    phone = ''.join(filter(str.isdigit, str(phone)))
    
    # Adiciona o código do país se não estiver presente
    if not phone.startswith('55'):
        phone = '55' + phone
    
    log_message(f"Enviando mensagens para: {phone}")
    
    # URL para abrir chat do WhatsApp com o número específico
    url = f"https://web.whatsapp.com/send?phone={phone}"
    webbrowser.open(url)
    
    # Aguarda o WhatsApp Web carregar
    time.sleep(15)  # Ajuste este tempo dependendo da velocidade da sua conexão
    
    # Envia cada mensagem na sequência
    for message in messages:
        # Digita a mensagem
        pyautogui.typewrite(message)
        time.sleep(1)
        
        # Envia a mensagem (tecla Enter)
        pyautogui.press('enter')
        time.sleep(2)  # Pausa entre mensagens
    
    # Fecha a aba após enviar todas as mensagens
    time.sleep(2)
    pyautogui.hotkey('ctrl', 'w')  # Fecha a aba atual
    time.sleep(1)

def main():
    try:
        # Caminho do arquivo CSV
        csv_file = input("Digite o caminho do arquivo CSV: ")
        
        # Link da oferta
        link = input("Digite o link da oferta: ")
        
        # Lê o arquivo CSV
        df = pd.read_csv(csv_file)
        
        # Verifica se as colunas necessárias existem
        required_columns = ['name', 'phone', 'group']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            log_message(f"Erro: Colunas ausentes no arquivo CSV: {', '.join(missing_columns)}")
            return
        
        log_message(f"Lido arquivo CSV com {len(df)} contatos.")
        
        # Abre o WhatsApp Web
        webbrowser.open("https://web.whatsapp.com/")
        
        # Aguarda tempo para fazer login
        log_message("Abra o WhatsApp Web e faça o login. Você tem 30 segundos...")
        time.sleep(30)
        
        # Para cada linha no CSV
        for index, row in df.iterrows():
            name = row['name']
            phone = row['phone']
            group = row['group']
            
            # Cria as mensagens personalizadas
            messages = [
                f"Olá tudo bem?",
                f"Vi que você está no grupo {group}, por isso fui falar com voce",
                f"Temos a seguinte oferta {link}"
            ]
            
            # Envia as mensagens
            try:
                send_whatsapp_message(phone, messages)
                log_message(f"Mensagens enviadas com sucesso para {name} ({phone})")
                
                # Pausa entre contatos para evitar detecção de spam
                time.sleep(5)
                
            except Exception as e:
                log_message(f"Erro ao enviar mensagens para {name} ({phone}): {str(e)}")
        
        log_message("Processo concluído!")
        
    except Exception as e:
        log_message(f"Erro no processo: {str(e)}")

if __name__ == "__main__":
    main()
  