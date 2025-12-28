package br.com.cantu.myapp;


import org.springframework.boot.SpringApplication;

public class AppManagerLocal {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "local,h2");
        SpringApplication.run(AppManager.class, args);
    }

}