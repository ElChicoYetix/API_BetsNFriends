const socket = io('/');

const userName = prompt("¿Cuál es tu nombre?");
document.getElementById('user').innerText = userName;

// Notificar al servidor cuando un usuario se conecta
socket.emit('newUser', { user: userName });

// Mostrar mensajes para eventos de chat
socket.on('newUser', (data) => {
    addMessage(`${data.user} se unió al chat`, 'new-user');
});

socket.on('newMessage', (data) => {
    addMessage(`${data.user}: ${data.message}`, 'message');
});

socket.on('userLeft', (data) => {
    addMessage(`${data.user} dejó el chat`, 'user-left');
});

// Función para agregar mensajes
function addMessage(content, className) {
    const message = document.createElement('p');
    message.className = className;
    message.innerText = content;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight; // Mantener el scroll al final
}

// Manejar el envío de nuevos mensajes
const chatForm = document.getElementById('chat-form');
const input = document.querySelector('input[name="newMessage"]');

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (message) {
        // Agregar el mensaje al chat y notificar a los demás
        addMessage(`Tú: ${message}`, 'message mine');
        socket.emit('newMessage', { user: userName, message });
        input.value = ''; // Limpiar el campo de texto
    }
});

// Advertencia antes de cerrar la ventana
window.onbeforeunload = () => {
    return '¿Seguro que quieres salir del chat?';
};
