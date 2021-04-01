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
        $(".editButton").on("click", editItem);

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
    let id = $('#id').val();
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
    let dataToServer;
    if (id !== "")
    {
        dataToServer = { id : id,
            first : firstName,
            last : lastName,
            email : email,
            phone : phone.replaceAll("-", ""),
            birthday : birthday}
    }
    else {
        dataToServer = {
            first : firstName,
            last : lastName,
            email : email,
            phone : phone.replaceAll("-", ""),
            birthday : birthday}

    }

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

function editItem(e) {
    console.debug("Edit");
    console.log("Edit: " + e.target.value);
    console.debug("Edit: " + e.target.value);

    // Grab the id from the event
    let id = e.target.value;

// This next line is fun.
// "e" is the event of the mouse click
// "e.target" is what the user clicked on. The button in this case.
// "e.target.parentNode" is the node that holds the button. In this case, the table cell.
// "e.target.parentNode.parentNode" is the parent of the table cell. In this case, the table row.
// "e.target.parentNode.parentNode.querySelectorAll("td")" gets an array of all matching table cells in the row
// "e.target.parentNode.parentNode.querySelectorAll("td")[0]" is the first cell. (You can grab cells 0, 1, 2, etc.)
// "e.target.parentNode.parentNode.querySelectorAll("td")[0].innerHTML" is content of that cell. Like "Sam" for example.
// How did I find this long chain? Just by setting a breakpoint and using the interactive shell in my browser.
    let first = e.target.parentNode.parentNode.querySelectorAll("td")[1].innerHTML.split(' ')[0];
    let last = e.target.parentNode.parentNode.querySelectorAll("td")[1].innerHTML.split(' ')[1];
    let email = e.target.parentNode.parentNode.querySelectorAll("td")[2].innerHTML;

    // Regular expression to match phone number pattern:
    // (515) 555-1212
    let phone = e.target.parentNode.parentNode.querySelectorAll("td")[3].innerHTML;
    let regexp = /\((\d{3})\) (\d{3})-(\d{4})/;
    let match = phone.match(regexp);
    // Log what we matched
    console.log("Matches:");
    console.log(match);
    // We how have a list, 1-3, where each one is part of the phone number.
    // Reformat into 515-555-1212
    let phoneString = match[1]+"-"+match[2]+"-"+match[3];

    let birthday = e.target.parentNode.parentNode.querySelectorAll("td")[4].innerHTML;
    // Parse date to current time in milliseconds
    let timestamp = Date.parse(birthday);
    // Made date object out of that time
    let dateObject = new Date(timestamp);
    // Convert to a full ISO formatted string
    let fullDateString = dateObject.toISOString();
    // Trim off the time part
    let shortDateString = fullDateString.split('T')[0];

    $('#id').val(id); // Yes, now we set and use the hidden ID field
    console.log(id);
    $('#firstName').val(first);
    $('#lastName').val(last);
    $('#email').val(email);
    $('#phone').val(phoneString);
    $('#birthday').val(shortDateString);


// Show the window
    $('#myModal').modal('show');
}

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


$(document).keydown(function(e) {
    //console.log(e.keyCode);
    if(e.keyCode == 65 && !$('#myModal').is(':visible')){
        showDialogAdd();
    }
    if(e.keyCode == 13 && $('#myModal').is(':visible')) {
        saveChanges();
    }
});

// If key is an enter key and dialog IS shown, save changes


$('#myModal').on('shown.bs.modal', function () {
    $('#firstName').focus();
})
