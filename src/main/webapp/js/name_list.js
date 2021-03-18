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
                '  <button type=\'button\' name=\'delete\' class=\'deleteButton btn btn-danger\' value=\''+jsonResult[i].id+'\'>\n' +
                '    Delete\n' +
                '  </button>\n' +
                '</td></td></td></td></td></td></tr>';
            $('#datatable tbody').append(html);

        }
        $(".deleteButton").on("click", deleteItem);

        console.log("Done");
    });
}

// Call your code.
updateTable();

// Delete item
function deleteItem(e) {
    console.log("Delete");
    console.log(e.target.value);
}

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

// There's a button in the form with the ID "addItem"
// Associate the function showDialogAdd with it.
let addItemButton = $('#addItem');
addItemButton.on("click", showDialogAdd);

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
    // Create the regular expression
    let reg = /^[A-Za-z-.'\u00C0-\u00FF(\s)]{1,10}$/;

    if (reg.test(firstName)) {
        $('#firstName').removeClass("is-invalid");
        $('#firstName').addClass("is-valid");
    } else {
        $('#firstName').removeClass("is-valid");
        $('#firstName').addClass("is-invalid");
        isValid = false;
    }

    if (reg.test(lastName)) {
        $('#lastName').removeClass("is-invalid");
        $('#lastName').addClass("is-valid");
    } else {
        $('#lastName').removeClass("is-valid");
        $('#lastName').addClass("is-invalid");
        isValid = false;
    }

    let regEmail = /^[a-zA-Z0-9-.]{1,15}@[A-Za-z-.]{1,15}.[A-Za-z]{3}$/;
    if (regEmail.test(email)) {
        $('#email').removeClass("is-invalid");
        $('#email').addClass("is-valid");
    } else {
        $('#email').removeClass("is-valid");
        $('#email').addClass("is-invalid");
        isValid = false;
    }

    let regPhone = /^\(?[1-9][0-9]{2}\)?-?[0-9]{3}-?[0-9]{4}$/;
    if (regPhone.test(phone)) {
        $('#phone').removeClass("is-invalid");
        $('#phone').addClass("is-valid");
    } else {
        $('#phone').removeClass("is-valid");
        $('#phone').addClass("is-invalid");
        isValid = false;
    }

    let regBirthday = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (regBirthday.test(birthday)) {
        $('#birthday').removeClass("is-invalid");
        $('#birthday').addClass("is-valid");
    } else {
        $('#birthday').removeClass("is-valid");
        $('#birthday').addClass("is-invalid");
        isValid = false;
    }

    console.log("Valid? " + isValid);

    let url = "api/name_list_edit";

    // Create a JSON object with field names and field values
    let dataToServer = { first : firstName,
        last : lastName,
        email : email,
        phone : phone.replaceAll("-", ""),
        birthday : birthday};

    if (isValid)
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
                } else {
                    updateTable();
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

function deleteItem(){

    console.log("Delete person");

    let url = "api/name_list_delete";

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
