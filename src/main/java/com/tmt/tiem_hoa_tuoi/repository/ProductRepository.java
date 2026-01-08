package com.tmt.tiem_hoa_tuoi.repository;

import com.tmt.tiem_hoa_tuoi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}