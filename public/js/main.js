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

async function proceder_fetch(url, method, data) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(url, options);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Erro ao realizar fetch:', error);
        return null;
    }
};

async function getGroups() {
    return await proceder_fetch('/api/groups', 'GET');
}

async function createGroup(name) {
    return await proceder_fetch(`/api/create/group`, 'POST',{"name":name});
}

async function createCompany(cnpj, name) {
    return await proceder_fetch(`/api/create/company`, 'POST',{"cnpj":cnpj,"name":name});
}

async function getCompanies() {
    return await proceder_fetch('/api/companies', 'GET');
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
    };
};


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
                <li><a class="dropdown-item" href="/admin/users/create">Cadastros</a></li>
            </ul>
        </li>
        `
        navbar.append(rootLi)

    }
    console.log(root)
}

function addParamsToUrl(params) {
    let url = new URL(window.location.href);

    for (let key in params) {
        url.searchParams.set(key, params[key]);
    }

    window.location.href = url.toString();
}

function removeParamFromUrl(key) {
    let url = new URL(window.location.href);

    url.searchParams.delete(key);

    window.location.href = url.toString();
}

function getAllUrlParamsIfAny() {
    // Cria um objeto URL com a URL atual
    let url = new URL(window.location.href);

    // Verifica se há parâmetros na URL
    if (url.searchParams.toString() === "") {
        return null; // Retorna null se não houver parâmetros
    }

    // Cria um objeto para armazenar os parâmetros
    let params = {};

    // Itera sobre todos os parâmetros da URL
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });

    // Retorna o objeto com os parâmetros
    return params;
}

function addLoading(elementId) {
    const spinner = `
    <div class="spinner-grow spinner-grow-sm" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    `;
    $(`#${elementId}`).html(spinner);
}

function removeLoading(elementId,text) {
    $(`#${elementId}`).html(text);
}

function addInvalidFeedback(elementId, message) {
    const existingFeedback = $(`#${elementId}`).next('.invalid-feedback');
    if (existingFeedback.length) {
        existingFeedback.text(message);
    } else {
        $(`#${elementId}`).after(`<div class="invalid-feedback">${message}</div>`);
    }
}