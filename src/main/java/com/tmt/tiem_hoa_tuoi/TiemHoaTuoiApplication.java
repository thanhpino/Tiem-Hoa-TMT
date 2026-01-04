package com.tmt.tiem_hoa_tuoi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TiemHoaTuoiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TiemHoaTuoiApplication.class, args);
	}

}
