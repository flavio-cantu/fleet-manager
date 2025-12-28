package br.com.cantu.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "br.com.cantu.myapp"
})
public class AppManager {
    public static void main(String[] args) {
        SpringApplication.run(AppManager.class, args);
    }
}
