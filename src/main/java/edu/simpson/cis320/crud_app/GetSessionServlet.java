package edu.simpson.cis320.crud_app;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

@WebServlet(name = "GetSessionServlet", value = "/api/get_session_servlet")
public class GetSessionServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // --- Sessions ---

        // - This example uses a session to keep count of client requests.
        HttpSession session = request.getSession();

        // At this point, you could grab something out of the session like:
        // String loginId = (String)session.getAttribute("loginId");

        // -- Example  1 --
        // Use a session attribute called "Count" which we'll increase
        // by one each time the user requests it.
        int myCount = 0;

        // Get the count variable
        Integer countObject = (Integer)session.getAttribute("Count");

        // If count is not null, we have a count. Counts have to be stored as
        // objects, and an 'int' isn't an object. So we have to cast it too/from
        // an Integer object.
        if(countObject != null)
            myCount = countObject.intValue();

        // Add one to count, cast it to Integer, store it back into the session.
        Integer newCount = new Integer(myCount + 1);
        session.setAttribute("Count", newCount);

        // -- Example 2 --
        // This example shows how to display the age of a session
        double ageInHours = (System.currentTimeMillis() - session.getCreationTime()) / (1000. * 60. * 60.);
        double lastAccessInHours = (System.currentTimeMillis() - session.getLastAccessedTime()) / (1000. * 60. * 60.);

        out.println(String.format("Session created %.3f hours ago.", ageInHours ));
        out.println(String.format("Last accessed   %.3f hours ago.", lastAccessInHours ));

        // -- Example 3 --
        // This example lists every session variable
        out.println("Session Attributes:");
        Enumeration<String> attributes = session.getAttributeNames();
        while(attributes.hasMoreElements()) {
            String attribute = attributes.nextElement();
            out.println(String.format("  %s = '%s'", attribute, session.getAttribute(attribute).toString()));
        }

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}