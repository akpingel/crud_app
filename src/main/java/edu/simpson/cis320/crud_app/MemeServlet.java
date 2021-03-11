package edu.simpson.cis320.crud_app;

import sun.jvm.hotspot.oops.OopUtilities;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "memeServlet", value = "/meme_servlet")
public class MemeServlet extends HttpServlet {
    private final static Logger log = Logger.getLogger(MemeServlet.class.getName());

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        log.log(Level.INFO, "Meme servlet");

        ServletContext context = getServletContext();
        InputStream  imageStream = context.getResourceAsStream("WEB-INF/classes/memebackground.jpg");
        BufferedImage image = ImageIO.read(imageStream);

        // Get graphics context (pen)
        Graphics g = image.getGraphics();

        // Set font
        String fontName = "Century Schoolbook";
        int fontSize = 50;
        int fontStyle = Font.BOLD;
        Font font = new Font(fontName, fontStyle, fontSize);
        g.setFont(font);

        // Draw string
        String message = request.getParameter("message");
        if (message == null)
        {
            message = "Simpson Storm";
        }

        // Set color
        Color myColor = new Color(0xFFFFFF);
        g.setColor(myColor);

        // Dispose of pen
        g.drawString(message, 100, 100);

        // Set color
        myColor = new Color(0xEEB41E);
        g.setColor(myColor);

        // Dispose of pen
        g.drawString(message, 102, 102);


        g.dispose();

        // Write out the image
        response.setContentType("image/jpg");
        OutputStream out = response.getOutputStream();
        ImageIO.write(image, "JPG", out);

    }

}