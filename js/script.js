document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade de mostrar/esconder senha
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#senha');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            // Alterna o tipo do input (password para text e vice-versa)
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            // Altera o ícone do olho
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    }

    // Você pode adicionar aqui validações de formulário (ex: e-mail válido)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Exemplo de validação simples
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value === '') {
                alert('Por favor, insira seu e-mail.');
                e.preventDefault();
            }
            // Adicione mais validações conforme a necessidade do seu backend.
        });
    }

    // Você pode adicionar aqui a lógica para simular o envio da recuperação de senha
    // e mostrar a tela de sucesso (3.png)
});