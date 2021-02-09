package edu.simpson.cis320.crud_app;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "NameListGetServlet", value = "/api/name_list_get")
public class NameListGetServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(NameListGetServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        log.log(Level.FINE, "Get people servlet");

        // Type of output (HTML, JSON, image, whatever
        response.setContentType("text/plain");

        // Get an object that can write to the network
        PrintWriter out = response.getWriter();

        // Write to the network
        out.print("Hello");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
