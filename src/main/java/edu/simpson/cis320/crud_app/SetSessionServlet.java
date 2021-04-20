package edu.simpson.cis320.crud_app;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SetSessionServlet", value = "/api/set_session_servlet")
public class SetSessionServlet extends HttpServlet {

    /** Method for posts */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Set up our response
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // Get the data passed in from the request string
        String sessionKey = request.getParameter("sessionKey");
        String sessionValue = request.getParameter("sessionValue");

        // Get a session object so we can get/set items in our session.
        // This will automatically create a JSESSIONID cookie for us.
        // It also must happen BEFORE we try writing output to the user.
        HttpSession session = request.getSession();

        // Associate, in server memory, a key/value pair.
        session.setAttribute(sessionKey, sessionValue);

        out.println("Done setting the session variable");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}