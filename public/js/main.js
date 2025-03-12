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

async function rootAdminMenu(){
    const username = localStorage.getItem('proceder_username');
    const response =  await fetch(`/api/users/isRoot/${username}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const root = await response.json()
    if (root.root){
        const navbar = $('#navbar-ul')
        const rootLi = `
         <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownadmin" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Admin
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownadmin">
                <li><h6 class="dropdown-header">Cadastros</h6></li>
                <li><a class="dropdown-item" href="/user/create">Usuário</a></li>
                <li><a class="dropdown-item" href="/user/group/create">Empresa</a></li>
                <li><a class="dropdown-item" href="/user/group/create">Grupo</a></li>
            </ul>
        </li>
        `
        navbar.append(rootLi)

    }
    console.log(root)
}

