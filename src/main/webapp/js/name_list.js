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

        for (let i = 0; i < jsonResult.length; i++) {
            // Print the name
            let bday = getJSDateFromSQLDate(jsonResult[i].birthday);
            let bdayString = bday.toLocaleDateString();
            console.log(bday);

            console.log(jsonResult[i].first, jsonResult[i].last, jsonResult[i].email);
            $('#datatable tbody:last').after('<tr><td>'+ jsonResult[i].id+'<td>'+
                htmlSafe(jsonResult[i].first)+ " " + htmlSafe(jsonResult[i].last)+'<td>'+
                htmlSafe(jsonResult[i].email) + '<td>' +
                formatPhoneNumber(htmlSafe(jsonResult[i].phone)) + '<td>' +
                htmlSafe(bdayString)+'</td></td></td></td></td></tr>');
        }
        $('#datatable tbody:first').remove();
        console.log("Done");
    });
}

// Call your code.
updateTable();