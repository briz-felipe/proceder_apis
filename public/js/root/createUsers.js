async function _createCompany() {
    const companyCnpj = $('#company_cnpj')
    const companyName = $('#company_name')

    
    const formValid = validateForm('companyForm');
    if(!formValid){
        return 
    }
    
    if (companyCnpj.val().length < 18) {
        companyCnpj.addClass('is-invalid');
        addInvalidFeedback('company_cnpj', 'Invalid CNPJ.');
        return;
    }
    try{
        const response = await createCompany(companyCnpj.val(),companyName.val())
        if (response && response.error) {
            console.error('Error creating company:', response.error);
            setAlert(response.error,false,'companyAlert');
            return;
        }
    
        $('.invalid-feedback').remove();
        companyCnpj.val('');
        companyName.val('');
        return response;
    } catch (error) {
        console.error('Unexpected error during company creation:', error);
        // Optionally handle unexpected errors with a generic message
        setAlert('An unexpected error occurred.',false,'companyAlert');
        return;
    }
};


async function _createGroup(name) {
    const groupNameValue = name || $('#group_name').val();
    console.log('groupNameValue:', groupNameValue);
    if (!groupNameValue) {
        $('#group_name').addClass('is-invalid');
        addInvalidFeedback('group_name', 'Group name is required.');
        return;
    }

    try {
        const response = await createGroup(groupNameValue);

        if (response && response.error) {
            console.error('Error creating group:', response.error);
            $('#group_name').addClass('is-invalid');
            addInvalidFeedback('group_name', response.error);
            return;
        }

        $('.invalid-feedback').remove();
        $('.is-invalid').removeClass('is-invalid').addClass('is-valid');
        $('#group_name').val('');
        return response;
   
    } catch (error) {
        console.error('Unexpected error during group creation:', error);
        // Optionally handle unexpected errors with a generic message
        $('#group_name').addClass('is-invalid');
        addInvalidFeedback('group_name', 'An unexpected error occurred.');
        return;
    }
}

async function _createUser(){
    const formValid = validateForm('createUserForm');
    if(!formValid){
        return 
    }
    
    const user = {
        username: $('#username').val(),
        email: $('#email').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
    }
    
    const groupName = $('textarea[name="userGroup"]').val() || '[]';
    const companyNames = $('textarea[name="userComanies"]').val() || '[]';
    
    if (groupName.length > 0) {
        user.groupName = JSON.parse(groupName).map(item => item.value);
    } else {user.groupName = []}
    if (companyNames.length > 0) {
        user.companyName = JSON.parse(companyNames).map(item => item.value);
    } else {user.companyName = []}

    console.log('user:', user);

    const response = await createAccess(user);
    if (response && response.error) {
        console.error('Error creating company:', response.error);
        setAlert(response.error,false,'userAlert');
        return response;
    }
    $('#username').val(''),
    $('#email').val(''),
    $('#firstName').val(''),
    $('#lastName').val(''),
    $('textarea[name="userComanies"]').val('')
    $('textarea[name="userGroup"]').val('')
    return response;
};

$(document).ready(()=>{
    checkTokenAndProceed(); // Check if token is valid
    rootAdminMenu(); // Show root admin menu

// função para pegar grupos assim que a pagina for carregada
    getGroups().then((groups)=>{
        const groupTableCard = $('#groupTableCard');

        const groupsName = groups.map(group => group.name);
        const userGroupTextarea = document.querySelector('textarea[name="userGroup"]'); // Selects only the userGroup textarea
        if (userGroupTextarea) {
            if (groupsName.length === 0) {
                groupTableCard.hide();
                userGroupTextarea.disabled = true;
            } else {
                appendTableFromJson(groups, 'groupTable', true);

                new Tagify(userGroupTextarea, {
                    enforceWhitelist: true,
                    delimiters: null,
                    keepInvalidTags: true,
                    duplicate: false,
                    whitelist: groupsName,
                    callbacks: {
                        add: console.log,  // callback when adding a tag
                        remove: console.log   // callback when removing a tag
                    }
                });
            }
        }
    });

// função para pegar empresas assim que a pagina for carregada
    getCompanies().then((companies)=>{
        const companiesName = companies.map(company => company.name);
        const companyTableCard = $('#companyTableCard');
        console.log(`empresas: ${companiesName}`);
        const userCompaniesTextarea = document.querySelector('textarea[name="userComanies"]'); // Selects only the userComanies textarea
        
        if (userCompaniesTextarea) {
            if (companiesName.length === 0) {
                companyTableCard.hide();
                userCompaniesTextarea.disabled = true;
            } else {
                companies.forEach(company => delete company.updatedAt);
                appendTableFromJson(companies, 'companyTable', true);
                new Tagify(userCompaniesTextarea, {
                    enforceWhitelist: true,
                    delimiters: null,
                    keepInvalidTags: true,
                    whitelist: companiesName,
                    callbacks: {
                        add: console.log,  // callback when adding a tag
                        remove: console.log   // callback when removing a tag
                    }
                });
            }
        }
    });
   
// evento para criar empresa
    $("#btnCreateCompany").click((e)=>{
        e.preventDefault();
        
        const btnCreateCompany = $('#btnCreateCompany');
        btnCreateCompany.attr('disabled', true);
        addLoading('btnCreateCompany')
        
        _createCompany().then(response => {
            console.log('response:', response);
            // response.forEach(company => delete company.updatedAt);
            appendTableFromJson([response], 'companyTable');
        }).finally(()=>{
            btnCreateCompany.attr('disabled', false);
            removeLoading('btnCreateCompany','Continuar')
        });
    });

    // evento para criar grupo
    $("#btnCreateGroup").click((e)=>{
        e.preventDefault();
        
        const btnCreateGroup = $('#btnCreateGroup');
        btnCreateGroup.attr('disabled', true);
        addLoading('btnCreateGroup')
        
        _createGroup().then(response => {
            appendTableFromJson([response], 'groupTable');
        }).finally(()=>{
            btnCreateGroup.attr('disabled', false);
            removeLoading('btnCreateGroup','Continuar')
        });
    })

    // evento para criar users
    $("#createUserButton").click((e)=>{
        e.preventDefault();
        const btnCreateUser = $('#createUserButton');
        btnCreateUser.attr('disabled', true);
        addLoading('createUserButton')
        _createUser()
        .then( response => {
            if (response && response.error) {
                setAlert(response.error,false,'userAlert');
                return
            }
            setAlert('Usuário criado com sucesso.',true,'userAlert');
            return 
        })
        .finally(()=>{
            btnCreateUser.attr('disabled', false);
            removeLoading('createUserButton','Continuar')
        });
        
    });

});