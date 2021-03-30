// Main Javascript File

function htmlSafe(data){
    return data.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
}
function formatPhoneNumber(phoneNumberString) {

    let cleaned = phoneNumberString.replace(/\D/g, '');

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
}

function getJSDateFromSQLDate(sqlDate) {
    // Strip non-digits
    let cleaned = sqlDate.replace(/\D/g, '');
    // Match and group
    let match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
    // Create a new Date object
    let resultDate = new Date(match[1], match[2], match[3]);
    return resultDate;
}

function updateTable() {
    // Here's where your code is going to go.
    console.log("updateTable called");

    let url = "api/name_list_get";

    $.getJSON(url, null, function(jsonResult) {

        $('#datatable tbody tr').remove();
        for (let i = 0; i < jsonResult.length; i++) {
            // Print the name
            let bday = getJSDateFromSQLDate(jsonResult[i].birthday);
            let bdayString = bday.toLocaleDateString();
            console.log(bday);

            console.log(jsonResult[i].first, jsonResult[i].last, jsonResult[i].email);
            let html = '<tr><td>'+ jsonResult[i].id+'<td>'+
                htmlSafe(jsonResult[i].first)+ " " + htmlSafe(jsonResult[i].last)+'<td>'+
                htmlSafe(jsonResult[i].email) + '<td>' +
                formatPhoneNumber(htmlSafe(jsonResult[i].phone)) + '<td>' +
                htmlSafe(bdayString)+'' +'' +
                '<td>\n' +
                '  <button type=\'button\' name=\'edit\' class=\'editButton btn btn-primary\' value=\''+jsonResult[i].id+'\'>\n' +
                '    Edit\n' +
                '  </button>\n' + '&nbsp' +
                '  <button type=\'button\' name=\'delete\' class=\'deleteButton btn btn-danger\' value=\''+jsonResult[i].id+'\'>\n' +
                '    Delete\n' +
                '  </button>\n' +
                '</td></td></td></td></td></tr>';
            $('#datatable tbody').append(html);

        }
        $(".deleteButton").on("click", deleteItem);
        let buttons = $(".editButton");
        buttons.on("click", editItem);

        console.log("Done");
    });
}

// Call your code.
updateTable();


// Called when "Add Item" button is clicked
function showDialogAdd() {

    // Print that we got here
    console.log("Opening add item dialog");

    // Clear out the values in the form.
    // Otherwise we'll keep values from when we last
    // opened or hit edit.
    // I'm getting it started, you can finish.
    $('#id').val("");
    $('#firstName').val("");
    $('#lastName').val("");
    $('#email').val("");
    $('#phone').val("");
    $('#birthday').val("");
    $('#firstName').removeClass("is-invalid");
    $('#firstName').removeClass("is-valid");
    $('#lastName').removeClass("is-invalid");
    $('#lastName').removeClass("is-valid");
    $('#email').removeClass("is-invalid");
    $('#email').removeClass("is-valid");
    $('#phone').removeClass("is-invalid");
    $('#phone').removeClass("is-valid");
    $('#birthday').removeClass("is-invalid");
    $('#birthday').removeClass("is-valid");

    // Show the hidden dialog
    $('#myModal').modal('show');

}

$('#myModal').on('shown.bs.modal', function () {
    $('#firstName').focus();
})

// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let addItemButton = $('#addItem');
addItemButton.on("click", showDialogAdd);

function fieldValidate(field, regex){

    let valid = true;

    // field = $('#field')
    // field.removeClass("is-invalid");
    // field.addClass("is-valid");
    //
    // return valid;

    if (regex.test(field.val())) {
        field.removeClass("is-invalid");
        field.addClass("is-valid");
        console.log("Valid is " + valid);

    } else {
        field.removeClass("is-valid");
        field.addClass("is-invalid");
        valid = false;
    }
    return valid;

}
function saveChanges(){

    console.log("Save changes test!!");
    let firstName = $('#firstName').val();
    console.log("First name: " + firstName);

    let lastName = $('#lastName').val();
    console.log("Last name: " + lastName);

    let email = $('#email').val();
    console.log("Email: " + email);

    let phone = $('#phone').val();
    console.log("Phone Number: " + phone);

    let birthday = $('#birthday').val();
    console.log("Birthday: " + birthday);

    let isValid = true;
    let success = true;

    //
    let firstNameField = $('#firstName');
    isValid = fieldValidate(firstNameField, /^[A-Za-z-.'\u00C0-\u00FF(\s)]{1,10}$/);
    if (!isValid) {
        firstNameField.focus();
        success = false;
    }

    let lastNameField = $('#lastName');
    isValid = fieldValidate(lastNameField, /^[A-Za-z-.'\u00C0-\u00FF(\s)]{1,10}$/);
    if (!isValid) {
        lastNameField.focus();
        success = false;
    }

    let emailField = $('#email');
    isValid = fieldValidate(emailField, /^[a-zA-Z0-9-.]{1,15}@[A-Za-z-.]{1,15}.[A-Za-z]{3}$/);
    if (!isValid) {
        emailField.focus();
        success = false;
    }
    let phoneNumberField = $('#phone');
    isValid = fieldValidate(phoneNumberField, /^\(?[1-9][0-9]{2}\)?-?[0-9]{3}-?[0-9]{4}$/);
    if (!isValid) {
        phoneNumberField.focus();
        success = false;
    }
    let birthdayField = $('#birthday');
    isValid = fieldValidate(birthdayField, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
    if (!isValid) {
        birthdayField.focus();
        success = false;
    }

    console.log("Valid? " + isValid);

    let url = "api/name_list_edit";

    // Create a JSON object with field names and field values
    let dataToServer = { first : firstName,
        last : lastName,
        email : email,
        phone : phone.replaceAll("-", ""),
        birthday : birthday};

    if (success)
    {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(dataToServer),
            success: function(dataFromServer) {
                console.log(dataFromServer);
                let result = JSON.parse(dataFromServer);
                if ('error' in result){
                    alert(result.error);
                    $('myToast').html("Error");
                    $('myToast').toast({delay: 5000});
                    $('#myToast').toast('show');
                } else {
                    $('#myModal').modal('hide');
                    updateTable();
                    $('myToast').html("Success! Record inserted");
                    $('myToast').toast({delay: 5000});
                    $('#myToast').toast('show');
                }
            },
            contentType: "application/json",
            dataType: 'text' // Could be JSON or whatever too

        });
    }
    console.log("end of function.");

}

let saveChangesButton = $('#saveChanges');
saveChangesButton.on("click", saveChanges);

function deleteItem(e){

    console.log("Delete person");

    let url = "api/name_list_delete";

    let id = e.target.value;

    console.log("id = " + id);

    // Create a JSON object with field names and field values
    let dataToServer = { id : id};

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(dataToServer),
        success: function(dataFromServer) {
            console.log(dataFromServer);
            let result = JSON.parse(dataFromServer);
            if ('error' in result){
                alert(result.error);
            } else {
                updateTable();
            }
        },
        contentType: "application/json",
        dataType: 'text' // Could be JSON or whatever too

        });
}

function editItem(e) {
    console.debug("Edit");
    console.debug("Edit: " + e.target.value);
}


$(document).keydown(function(e) {
    //console.log(e.keyCode);
    if(e.keyCode == 65 && !$('#myModal').is(':visible')){
        showDialogAdd();
    }
});

$('#myModal').on('shown.bs.modal', function () {
    $('#firstName').focus();
})
