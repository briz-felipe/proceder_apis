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


$(document).ready(()=>{
    console.log('main.js loaded');
    checkTokenAndProceed();
    rootAdminMenu();
    const groupTableBody = $('#groupTable');

    
    $("#btnCreateGroup").click((e)=>{
        e.preventDefault();
        
        const btnCreateGroup = $('#btnCreateGroup');
        btnCreateGroup.attr('disabled', true);
        addLoading('btnCreateGroup')
        
        _createGroup().then(response => {
            console.log('Group created:', response);
            const row = `
            <tr>
                <td>${response.id}</td>
                <td>${response.name}</td>
                <td>${response.createdAt}</td>
            </tr>`;
            groupTableBody.append(row);
            
        }).finally(()=>{
            btnCreateGroup.attr('disabled', false);
            removeLoading('btnCreateGroup','Continuar')
        });
    })
    getGroups().then((groups)=>{
        const groupTableCard = $('#groupTableCard');

        const groupsName = groups.map(group => group.name);
        const userGroupTextarea = document.querySelector('textarea[name="userGroup"]'); // Selects only the userGroup textarea
        if (userGroupTextarea) {
            if (groupsName.length === 0) {
                groupTableCard.hide();
                userGroupTextarea.disabled = true;
            } else {
                groupTableBody.empty();
                groups.forEach(group => {
                    const row = `
                    <tr>
                        <td>${group.id}</td>
                        <td>${group.name}</td>
                        <td>${group.createdAt}</td>
                    </tr>`;
                    groupTableBody.append(row);
                });

                new Tagify(userGroupTextarea, {
                    enforceWhitelist: true,
                    delimiters: null,
                    keepInvalidTags: true,
                    whitelist: groupsName,
                    callbacks: {
                        add: console.log,  // callback when adding a tag
                        remove: console.log   // callback when removing a tag
                    }
                });
            }
        }
    });

    getCompanies().then((companies)=>{
        const companiesName = companies.map(company => company.name);
        console.log(`empresas: ${companiesName}`);
        const userCompaniesTextarea = document.querySelector('textarea[name="userComanies"]'); // Selects only the userComanies textarea
        
        if (userCompaniesTextarea) {
            if (companiesName.length === 0) {
                userCompaniesTextarea.disabled = true;
            } else {
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
});