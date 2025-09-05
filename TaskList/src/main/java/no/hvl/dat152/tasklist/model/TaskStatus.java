package no.hvl.dat152.tasklist.model;

import no.hvl.dat152.tasklist.enums.TaskStatuses;

public class TaskStatus {
    private TaskStatuses status;

    public TaskStatus() {
    }

    public TaskStatuses getStatus() {
        return status;
    }

    public void setStatus(TaskStatuses status) {
        this.status = status;
    }
}
