// used in index.ejs

$('#form-login').submit(function (event) {
    // dont submit form
    event.preventDefault();
    // ajax login
    $.ajax('/api/account/login', {
        method: 'post',
        data: $('#form-login').serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.error == 0) {
                document.location.href = '/dashboard';
            } else {
                $('#message').empty().append('<p>' + response.status + '</p>').show();
            }
        }
    });
});

$('#form-register').submit(function (event) {
    event.preventDefault();
    $.ajax('/api/account/create', {
        method: 'post',
        data: $('#form-register').serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.error == 0) {
                document.location.href = '/dashboard';
            } else {
                $('#message').empty().append('<p>' + response.status + '</p>').show();
            }
        }
    });
});

$('#form-login-facebook').submit(function (event) {
    event.preventDefault();
    $.ajax('/api/account/loginfacebook', {
        method: 'post',
        data: $('#form-login-facebook').serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.error == 0) {
                document.location.href = '/dashboard';
            } else {
                $('#messageErrorFacebook').empty().append('<div class=\"alert alert-error\"><p>' + response.status + '</p></div>').show();
            }
        }
    });
});

