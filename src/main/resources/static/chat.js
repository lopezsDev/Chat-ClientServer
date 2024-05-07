let stompClient = null;

function connect() {
  const socket = new SockJS('/chat-websocket');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnected, onError);
}

function onConnected() {
  stompClient.subscribe('/topic/public', onMessageReceived);
}

function onMessageReceived(payload) {
  const message = JSON.parse(payload.body);
  const chatMessages = document.getElementById('chat-messages');
  // Verificar si el mensaje tiene contenido antes de crear el elemento
  if (message.content) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.sender}: ${message.content}`;
    chatMessages.appendChild(messageElement);
  }
}

function onError(error) {
  console.error(error);
}

// Nueva función para enviar el mensaje
function sendMessage() {
  const username = document.getElementById('username').value;
  const messageInput = document.getElementById('message');
  const message = messageInput.value.trim();
  if (message !== '') {
    const chatMessage = { sender: username, content: message };
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    messageInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  connect();

  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message');

  // Controlador de eventos click para el botón "Enviar"
  sendButton.addEventListener('click', sendMessage);

  // Controlador de eventos keydown para el campo de entrada de mensaje
  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // Llamar a la función sendMessage() si se presiona la tecla Enter
      sendMessage();
    }
  });
});