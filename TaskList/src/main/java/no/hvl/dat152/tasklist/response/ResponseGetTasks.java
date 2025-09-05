package no.hvl.dat152.tasklist.response;

import no.hvl.dat152.tasklist.model.Task;

public class ResponseGetTasks extends ServerResponse {

	private Iterable<Task> tasks;

	public Iterable<Task> getTasks() {
		return tasks;
	}

	public void setTasks(Iterable<Task> tasks) {
		this.tasks = tasks;
	}
}
