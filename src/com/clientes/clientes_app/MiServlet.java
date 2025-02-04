package com.clientes.clientes_app;

import java.io.File;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class MiServlet extends HttpServlet {

    // Método doPost para manejar los datos del formulario
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Verificar si el formulario contiene archivos
        if (ServletFileUpload.isMultipartContent(request)) {
            // Crear el objeto para manejar la subida
            DiskFileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            
            try {
                // Parsear la solicitud y obtener los items
                List<FileItem> items = upload.parseRequest(request);
                
                // Inicializar variables para los datos del formulario
                String nombre = "";
                String apellido1 = "";
                String apellido2 = "";
                String codigo = "";
                String pasaporte = "";
                String fechaNacimiento = "";
                String calle = "";
                String portal = "";
                String piso = "";
                String escalera = "";
                String codigoPostal = "";
                String provincia = "";
                String comunidad = "";
                String dni = "";

                for (FileItem item : items) {
                    if (item.isFormField()) {
                        // Si es un campo de texto (no un archivo)
                        String fieldName = item.getFieldName();
                        String fieldValue = item.getString();

                        // Usamos el switch para asignar los valores
                        switch (fieldName) {
                            case "nombre":
                                nombre = fieldValue;
                                break;
                            case "apellido1":
                                apellido1 = fieldValue;
                                break;
                            case "apellido2":
                                apellido2 = fieldValue;
                                break;
                            case "codigo":
                                codigo = fieldValue;
                                break;
                            case "pasaporte":
                                pasaporte = fieldValue;
                                break;
                            case "fecha_nacimiento":
                                fechaNacimiento = fieldValue;
                                break;
                            case "calle":
                                calle = fieldValue;
                                break;
                            case "portal":
                                portal = fieldValue;
                                break;
                            case "piso":
                                piso = fieldValue;
                                break;
                            case "escalera":
                                escalera = fieldValue;
                                break;
                            case "codigo_postal":
                                codigoPostal = fieldValue;
                                break;
                            case "provincia":
                                provincia = fieldValue;
                                break;
                            case "comunidad":
                                comunidad = fieldValue;
                                break;
                            default:
                               break;
                        }
                    } else {
                        // Si es un archivo
                        String fieldName = item.getFieldName();
                        if (fieldName.equals("dni")) {
                            // Obtener el nombre del archivo (DNI)
                            dni = item.getName();
                            // Guardar el archivo en el servidor
                            File archivo = new File("ruta/del/servidor/" + dni);
                            item.write(archivo);
                        }
                    }
                }

                // Ahora puedes acceder a los valores de los campos
                System.out.println("Nombre: " + nombre);
                System.out.println("Apellido 1: " + apellido1);
                System.out.println("Apellido 2: " + apellido2);
                System.out.println("Código: " + codigo);
                System.out.println("Pasaporte: " + pasaporte);
                System.out.println("Fecha de nacimiento: " + fechaNacimiento);
                System.out.println("Calle: " + calle);
                System.out.println("Portal: " + portal);
                System.out.println("Piso: " + piso);
                System.out.println("Escalera: " + escalera);
                System.out.println("Código Postal: " + codigoPostal);
                System.out.println("Provincia: " + provincia);
                System.out.println("Comunidad: " + comunidad);
                System.out.println("DNI (archivo): " + dni);

                // Responder al cliente
                response.getWriter().println("Formulario recibido correctamente.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
