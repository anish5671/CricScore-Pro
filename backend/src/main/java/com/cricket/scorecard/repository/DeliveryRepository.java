package com.cricket.scorecard.repository;

import com.cricket.scorecard.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByInningsId(Long inningsId);
    List<Delivery> findByInningsIdAndOverNumber(Long inningsId, Integer overNumber);
}