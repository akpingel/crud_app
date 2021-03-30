package edu.simpson.cis320.crud_app;

import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet(name = "NameListEditServlet", value = "/api/name_list_edit")
public class NameListEditServlet extends HttpServlet{
    private final static Logger log = Logger.getLogger(NameListEditServlet.class.getName());

    private Pattern nameValidationPattern;
    private Pattern emailValidationPattern;
    private Pattern phoneValidationPattern;
    private Pattern birthdayValidationPattern;

    public NameListEditServlet(){
        nameValidationPattern = Pattern.compile("^[A-Za-z-.'\\u00C0-\\u00FF(\\s)]{1,10}$");
        emailValidationPattern = Pattern.compile("^[a-zA-Z0-9-.]{1,15}@[A-Za-z-.]{1,15}.[A-Za-z]{3}$");
        phoneValidationPattern = Pattern.compile("^\\(?[1-9][0-9]{2}\\)?-?[0-9]{3}-?[0-9]{4}$");
        birthdayValidationPattern = Pattern.compile("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        log.log(Level.INFO, "doPost for NameListEditServlet");

        // You can output in any format, text/JSON, text/HTML, etc. We'll keep it simple
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // Open the request for reading. Read in each line, put it into a string.
        // Yes, I think there should be an easier way.
        java.io.BufferedReader in = request.getReader();
        String requestString = new String();
        for (String line; (line = in.readLine()) != null; requestString += line);

        // Log the string we got as a request, just as a check
        log.log(Level.INFO, requestString);

        // Great! Now we want to parse the object, and pop it into our business object. Field
        // names have to match. That's the magic.

        Jsonb jsonb = JsonbBuilder.create();
        Person personObject = jsonb.fromJson(requestString, Person.class);

        response.setContentType("application/json");

        // Matcher Object
        Matcher m = nameValidationPattern.matcher(personObject.getFirst());
        if (!m.find()) {
            out.println("{\"error\" : \"Error validating first name.\"}");
            return;
        }
        m = nameValidationPattern.matcher(personObject.getLast());
        if (!m.find()) {
            out.println("{\"error\" : \"Error validating last name.\"}");
            return;
        }
        m = emailValidationPattern.matcher(personObject.getEmail());
        if (!m.find()) {
            out.println("{\"error\" : \"Error validating email.\"}");
            return;
        }
        m = phoneValidationPattern.matcher(personObject.getPhone());
        if (!m.find()) {
            out.println("{\"error\" : \"Error validating phone number.\"}");
            return;
        }
        m = birthdayValidationPattern.matcher(personObject.getBirthday());
        if (!m.find()) {
            out.println("{\"error\" : \"Error validating birthday.\"}");
            return;
        }

        out.println("{\"success\": \"Successful insert.\"}");

        // Log info as a check
        log.log(Level.INFO, "Person test: "+personObject.getBirthday());

        // Send something back to the client. Really, we should send a JSON, but
        // we'll keep things simple.
        //out.println("Object test: "+personObject.getBirthday());

        PersonDAO.addPerson(personObject);
    }
}
