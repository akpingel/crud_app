package edu.simpson.cis320.crud_app;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.List;
import java.util.LinkedList;
import java.sql.PreparedStatement;

/**
 * Data Access Object for the Person table/class
 */
public class PersonDAO {
    private final static Logger log = Logger.getLogger(PersonDAO.class.getName());

    /**
     * Get a list of the people in the database.
     * @return Returns a list of instances of the People class.
     */
    public static List<Person> getPeople() {
        log.log(Level.FINE, "Get people");

        // Create an empty linked list to put the people we get from the
        // database into.
        List<Person> list = new LinkedList<Person>();

        // Declare our variables
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        // Databases are unreliable. Use some exception handling
        try {
            // Get our database connection
            conn = DBHelper.getConnection();

            // This is a string that is our SQL query.
            // Update for all our fields

            String sql = "select id, first, last, email, phone, birthday from person order by last, first";


            // If you had parameters, it would look something like
            // String sql = "select id, first, last, phone from person where id = ?";

            // Create an object with all the info about our SQL statement to run.
            stmt = conn.prepareStatement(sql);

            // If you had parameters, they would be set wit something like:
            // stmt.setString(1, "1");

            // Execute the SQL and get the results
            rs = stmt.executeQuery();

            // Loop through each record
            while(rs.next()) {
                // Create a new instance of the Person object.
                // You'll need to define that somewhere. Just a simple class
                // with getters and setters on the fields.
                Person person = new Person();

                // Get the data from the result set, and copy it to the Person
                // object.
                person.setId(rs.getInt("id"));
                person.setFirst(rs.getString("first"));
                person.setLast(rs.getString("last"));
                person.setEmail(rs.getString("email"));
                person.setPhone(rs.getString("phone"));
                person.setBirthday(rs.getString("birthday"));

                /* FILL IN THE REST HERE */

                // Add this person to the list so we can return it.
                list.add(person);
            }
        } catch (SQLException se) {
            log.log(Level.SEVERE, "SQL Error", se );
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error", e );
        } finally {
            // Ok, close our result set, statement, and connection
            try { if (rs != null) rs.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(stmt != null) stmt.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(conn != null) conn.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }
        }
        // Done! Return the results
        return list;
    }

    public static void addPerson(Person newPerson){
        log.log(Level.FINE, "Get people");

        // Declare our variables
        Connection conn = null;
        PreparedStatement stmt = null;
        //int rs;

        // Databases are unreliable. Use some exception handling
        try {
            // Get our database connection
            conn = DBHelper.getConnection();

            // This is a string that is our SQL query.
            // Update for all our fields

            log.log(Level.INFO, "Get first " + newPerson.getFirst());

            String sql = "INSERT INTO person (first, last, email, phone, birthday) VALUES (?, ?, ?, ?, ?);";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, newPerson.getFirst());
            stmt.setString(2, newPerson.getLast());
            stmt.setString(3, newPerson.getEmail());
            stmt.setString(4, newPerson.getPhone());
            stmt.setString(5, newPerson.getBirthday());

            stmt.executeUpdate();

        } catch (SQLException se) {
            log.log(Level.SEVERE, "SQL Error", se );
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error", e );
        } finally {
            // Ok, close our result set, statement, and connection
//            try { if (rs != null) rs.close(); }
//            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(stmt != null) stmt.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(conn != null) conn.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }
        }
    }

    public static void editPerson(Person getPerson){
        log.log(Level.FINE, "Edit people");

        // Declare our variables
        Connection conn = null;
        PreparedStatement stmt = null;
        //int rs;

        // Databases are unreliable. Use some exception handling
        try {
            // Get our database connection
            conn = DBHelper.getConnection();

            // This is a string that is our SQL query.
            // Update for all our fields

            log.log(Level.INFO, "Get edit person id " + getPerson.getId());

            String sql = "update person set first=?, last=?, email=?, phone=?, birthday=? where id=?";

            stmt = conn.prepareStatement(sql);
            stmt.setString(1, getPerson.getFirst());
            stmt.setString(2, getPerson.getLast());
            stmt.setString(3, getPerson.getEmail());
            stmt.setString(4, getPerson.getPhone());
            stmt.setString(5, getPerson.getBirthday());
            stmt.setInt(6, getPerson.getId());

            stmt.executeUpdate();

        } catch (SQLException se) {
            log.log(Level.SEVERE, "SQL Error", se );
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error", e );
        } finally {
            // Ok, close our result set, statement, and connection
//            try { if (rs != null) rs.close(); }
//            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(stmt != null) stmt.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(conn != null) conn.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }
        }
    }

    public static void deletePerson(Person deletePerson){

        log.log(Level.FINE, "Delete person");

        // Declare our variables
        Connection conn = null;
        PreparedStatement stmt = null;
        //int rs;

        // Databases are unreliable. Use some exception handling
        try {
            // Get our database connection
            conn = DBHelper.getConnection();

            // This is a string that is our SQL query.
            // Update for all our fields

            log.log(Level.INFO, "Get id " + deletePerson.getId());

            String sql = "delete from person where id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, deletePerson.getId());


            stmt.executeUpdate();

        } catch (SQLException se) {
            log.log(Level.SEVERE, "SQL Error", se );
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error", e );
        } finally {
            // Ok, close our result set, statement, and connection
//            try { if (rs != null) rs.close(); }
//            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(stmt != null) stmt.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }

            try { if(conn != null) conn.close(); }
            catch (Exception e) { log.log(Level.SEVERE, "Error", e ); }
        }
    }

}