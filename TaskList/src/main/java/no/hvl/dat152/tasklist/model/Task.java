package no.hvl.dat152.tasklist.model;

import no.hvl.dat152.tasklist.enums.TaskStatuses;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(schema = "workorganizer", name = "task")
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", updatable = false, nullable = false)
	private Integer id;

	private String title;

	@Column(columnDefinition = "ENUM('WAITING', 'ACTIVE', 'DONE')")
	@Enumerated(EnumType.STRING)
	private TaskStatuses status;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public TaskStatuses getStatus() {
		return status;
	}

	public void setStatus(TaskStatuses status) {
		this.status = status;
	}
}
