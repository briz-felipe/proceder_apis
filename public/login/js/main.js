function login() {
    let username = $('#username').val();
    let password = $('#password').val();
    let data = {
        username: username,
        password: password
    };
    $.ajax({
        url: '/auth/login',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.token) {
                localStorage.setItem('token', response.token);
                window.location.href = '/dashboard';
            } else {
                set_alert(response.error, false, 'auth-alert');
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON.error
            console.log(msg);
            set_alert(msg, false, 'auth-alert');
        }
    });
}

$(document).ready(() => {
    console.log('Document is ready');
    $("#login-form").submit((e) => {
        e.preventDefault();
        login();
    });
});
