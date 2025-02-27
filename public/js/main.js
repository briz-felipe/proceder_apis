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


console.log('Document is ready');