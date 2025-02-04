package com.clientes.clientes_app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;

public class ClienteService {

    private static final String FILE_PATH = "clientes.json"; // Ruta del archivo JSON

    // Crear un nuevo cliente y almacenarlo en el archivo JSON
    public void crearCliente(Cliente cliente) {
        JSONArray clientes = leerClientes(); // Leer los clientes existentes

        // Crear un nuevo objeto JSON para el cliente
        JSONObject clienteJson = new JSONObject();
        clienteJson.put("nombre", cliente.getNombre());
        clienteJson.put("apellido1", cliente.getApellido1());
        clienteJson.put("apellido2", cliente.getApellido2());
        clienteJson.put("codigo", cliente.getCodigo());
        clienteJson.put("pasaporte", cliente.getPasaporte());
        clienteJson.put("calle", cliente.getCalle());
        clienteJson.put("portal", cliente.getPortal());
        clienteJson.put("piso", cliente.getPiso());
        clienteJson.put("escalera", cliente.getEscalera());
        clienteJson.put("codigoPostal", cliente.getCodigoPostal());
        clienteJson.put("provincia", cliente.getProvincia());
        clienteJson.put("comunidad", cliente.getComunidad());
        clienteJson.put("dni", cliente.getDni());

        // Formatear la fecha en un formato de cadena legible
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        clienteJson.put("fechaNacimiento", sdf.format(cliente.getFechaNacimiento()));

        // Agregar el cliente a la lista
        clientes.add(clienteJson);

        // Guardar la lista actualizada en el archivo
        try (FileWriter file = new FileWriter(FILE_PATH)) {
            file.write(clientes.toJSONString());
            System.out.println("Cliente creado y guardado");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Leer los clientes desde el archivo JSON
    public JSONArray leerClientes() {
        JSONArray clientes = new JSONArray();

        try (FileReader reader = new FileReader(FILE_PATH)) {
            // Leer el archivo JSON
            clientes = (JSONArray) new org.json.simple.parser.JSONParser().parse(reader);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return clientes;
    }

    // Actualizar un cliente existente
    public void actualizarCliente(String nombre, String nuevoEmail) {
        JSONArray clientes = leerClientes();

        for (Object obj : clientes) {
            JSONObject clienteJson = (JSONObject) obj;
            if (clienteJson.get("nombre").equals(nombre)) {
                clienteJson.put("email", nuevoEmail); // Actualizar el email
                break;
            }
        }

        // Guardar los cambios en el archivo
        try (FileWriter file = new FileWriter(FILE_PATH)) {
            file.write(clientes.toJSONString());
            System.out.println("Cliente actualizado");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Eliminar un cliente por nombre
    public void eliminarCliente(String nombre) {
        JSONArray clientes = leerClientes();

        // Eliminar el cliente por nombre
        clientes.removeIf(cliente -> ((JSONObject) cliente).get("nombre").equals(nombre));

        // Guardar la lista actualizada en el archivo
        try (FileWriter file = new FileWriter(FILE_PATH)) {
            file.write(clientes.toJSONString());
            System.out.println("Cliente eliminado");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
