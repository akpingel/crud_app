// This calls our back-end Java program that sets our session info
function login() {

    var url = "api/login_servlet";

    // Grab data from the HTML form
    var loginID = $("#loginID").val();

    // Create a JSON request based on that data
    var dataToServer = {"loginID" : loginID};
    console.log(dataToServer);

    // Post
    $.post(url, dataToServer, function (dataFromServer) {
        // We are done. Write a message to our console
        console.log("Finished calling servlet. \""+dataFromServer+"\"");
        console.log(dataFromServer);
        // Clear the form
        $("#loginID").val("");
    });
    getLogin()
}

// This gets session info from our back-end servlet.
function getLogin() {

    var url = "api/get_login_servlet";

    $.post(url, null, function (dataFromServer) {
        console.log("Finished calling servlet.");
        console.log(dataFromServer);
        // Update the HTML with our result
        $('#getLoginResult').html(dataFromServer)
    });

}

// This method calls the servlet that invalidates our session
function logout() {

    var url = "api/logout_servlet";

    $.post(url, null, function (dataFromServer) {
        console.log("Finished calling servlet.");
        console.log(dataFromServer);
    });
    getLogin();
}

// Hook the functions above to our buttons
button = $('#getLogin');
button.on("click", getLogin);

button = $('#loginButton');
button.on("click", login);

button = $('#logout');
button.on("click", logout());

getLogin();