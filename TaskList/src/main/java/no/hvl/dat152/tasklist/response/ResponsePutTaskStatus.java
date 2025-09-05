package no.hvl.dat152.tasklist.response;

import no.hvl.dat152.tasklist.enums.TaskStatuses;

public class ResponsePutTaskStatus extends ServerResponse {
    private Integer id;
    private TaskStatuses status;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public TaskStatuses getStatus() {
        return status;
    }
    public void setStatus(TaskStatuses status) {
        this.status = status;
    }
}
