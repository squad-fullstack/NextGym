package com.nextgym.domain.models;

public class Profissional {
    private Long id;
    private String nome;
    private String cref;
    private String email;
    private String senha;
    private Role role;

    public Profissional() {}

    public Profissional(Long id, String nome, String cref, String email, String senha, Role role) {
        this.id = id;
        this.nome = nome;
        this.cref = cref;
        this.email = email;
        this.senha = senha;
        this.role = role;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCref() { return cref; }
    public void setCref(String cref) { this.cref = cref; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}