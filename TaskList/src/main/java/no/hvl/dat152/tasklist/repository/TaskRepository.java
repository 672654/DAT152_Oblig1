package no.hvl.dat152.tasklist.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.CrudRepository;

import jakarta.persistence.LockModeType;
import no.hvl.dat152.tasklist.model.Task;

public interface TaskRepository extends CrudRepository<Task, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Task> findById(Integer id);
    
    @Lock(LockModeType.PESSIMISTIC_READ)
    Iterable<Task> findAll();
}
