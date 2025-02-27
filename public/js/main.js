function set_alert(message, status, elementId) {
    const type = status ? 'success' : 'danger';
    const alertElement = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>Atenção!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
    $(`#${elementId}`).html(alertElement);
}

async function isTokenValid(token) {
    try {
        const response = await fetch('/auth/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.valid;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        return false;
    }
}


function logout() {
    $.ajax({
        url: '/auth/logout',
        type: 'POST',
        success: function () {
            localStorage.removeItem('token');
            window.location.href = '/?logout=true';
        }
    });
}

async function checkTokenAndProceed() {
    const token = localStorage.getItem('token');
    if (token) {
        const valid = await isTokenValid(token);
        if (valid) {
            console.log('Token is valid');
            return;
        };
    };
    window.location.href = '/?unauthorized=true';
}

