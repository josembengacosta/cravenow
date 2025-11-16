 // Fuscriptara definir um cookie
        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Função para obter o valor de um cookie
        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // Função para mostrar o alerta de cookies
        function showCookieAlert() {
            const cookieAlert = document.getElementById("cookie-alert");
            cookieAlert.style.display = "block";
        }

        // Verificar se o cookie de consentimento já existe
        window.onload = function () {
            if (!getCookie("cookiesAccepted_wp")) {
                showCookieAlert();
            }
        };

        // Aceitar todos os cookies
        document.getElementById("accept-cookies").addEventListener("click", function () {
            setCookie("cookiesAccepted_wp", "true", 365);
            document.getElementById("cookie-alert").style.display = "none";
        });

        // Rejeitar todos os cookies
        document.getElementById("reject-cookies").addEventListener("click", function () {
            setCookie("cookiesAccepted_wp", "false", 365);
            document.getElementById("cookie-alert").style.display = "none";
        });
    