package com.tmt.tiem_hoa_tuoi.repository;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;
import com.tmt.tiem_hoa_tuoi.entity.User;
import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<FlowerOrder, Long> {
    List<FlowerOrder> findByUserOrderByOrderDateDesc(User user);

    List<FlowerOrder> findByUser(User user, Sort sort);
}