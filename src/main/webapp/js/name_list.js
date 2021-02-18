// Main Javascript File

function htmlSafe(data){
    return data.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
}

function updateTable() {
    // Here's where your code is going to go.
    console.log("updateTable called");

    let url = "api/name_list_get";

    $.getJSON(url, null, function(jsonResult) {

        for (let i = 0; i < jsonResult.length; i++) {
            // Print the name
            console.log(jsonResult[i].first, jsonResult[i].last, jsonResult[i].email);
            $('#datatable tbody:last').after('<tr><td>'+ jsonResult[i].id+'<td>'+
                htmlSafe(jsonResult[i].first)+ " " + htmlSafe(jsonResult[i].last)+'<td>'+
                htmlSafe(jsonResult[i].birthday) + '<td>' +
                htmlSafe(jsonResult[i].email) + '<td>' +
                htmlSafe(jsonResult[i].phone)+'</td></td></td></td></td></tr>');
        }
        $('#datatable tbody:first').remove();
        console.log("Done");
    });
}

// Call your code.
updateTable();