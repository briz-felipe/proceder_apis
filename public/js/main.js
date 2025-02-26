$(document).ready(function() {
    $.ajax({
        url: '/data',
        method: 'GET',
        success: function(data) {
            $('#card-title').text(data.title);
            $('#card-text').text(data.message);
            $('#card-button').text(data.buttonText);
        }
    });
});