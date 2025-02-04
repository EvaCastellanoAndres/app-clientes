package com.clientes.clientes_app;
import java.util.Date;

public class Cliente {
    private String nombre;
    private String apellido1;
    private String apellido2;
    private String codigo;
    private String pasaporte;
    private String calle;
    private String portal;
    private String piso;
    private String escalera;
    private String codigoPostal;
    private String provincia;
    private String comunidad;
    private String dni;  // Foto: DNI
    private Date fechaNacimiento;

    // Constructor
    public Cliente(String nombre, String apellido1, String apellido2, String codigo, String pasaporte,
                   String calle, String portal, String piso, String escalera, String codigoPostal,
                   String provincia, String comunidad, String dni, Date fechaNacimiento) {
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.codigo = codigo;
        this.pasaporte = pasaporte;
        this.calle = calle;
        this.portal = portal;
        this.piso = piso;
        this.escalera = escalera;
        this.codigoPostal = codigoPostal;
        this.provincia = provincia;
        this.comunidad = comunidad;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido1() {
        return apellido1;
    }

    public void setApellido1(String apellido1) {
        this.apellido1 = apellido1;
    }

    public String getApellido2() {
        return apellido2;
    }

    public void setApellido2(String apellido2) {
        this.apellido2 = apellido2;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getPasaporte() {
        return pasaporte;
    }

    public void setPasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getPortal() {
        return portal;
    }

    public void setPortal(String portal) {
        this.portal = portal;
    }

    public String getPiso() {
        return piso;
    }

    public void setPiso(String piso) {
        this.piso = piso;
    }

    public String getEscalera() {
        return escalera;
    }

    public void setEscalera(String escalera) {
        this.escalera = escalera;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getComunidad() {
        return comunidad;
    }

    public void setComunidad(String comunidad) {
        this.comunidad = comunidad;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    // Método para representar al cliente como un String
    @Override
    public String toString() {
        return "Cliente{" +
                "nombre='" + nombre + '\'' +
                ", apellido1='" + apellido1 + '\'' +
                ", apellido2='" + apellido2 + '\'' +
                ", codigo='" + codigo + '\'' +
                ", pasaporte='" + pasaporte + '\'' +
                ", calle='" + calle + '\'' +
                ", portal='" + portal + '\'' +
                ", piso='" + piso + '\'' +
                ", escalera='" + escalera + '\'' +
                ", codigoPostal='" + codigoPostal + '\'' +
                ", provincia='" + provincia + '\'' +
                ", comunidad='" + comunidad + '\'' +
                ", dni='" + dni + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                '}';
    }
}