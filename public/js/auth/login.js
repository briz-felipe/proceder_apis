$(document).ready(() => {
    console.log('Document is ready');
    $("#login-form").submit((e) => {
        e.preventDefault();
       
        let username = $('#username').val();
        let password = $('#password').val();

        proceder_login(username, password).then((response) => {
            if (response && response.error) {
                set_alert(response.error, false, 'auth-alert');
            }else{
                location.href = response.redirect;
            }
        });
    });
});
