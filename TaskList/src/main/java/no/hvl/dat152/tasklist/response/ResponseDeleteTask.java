package no.hvl.dat152.tasklist.response;

public class ResponseDeleteTask extends ServerResponse {
    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer taskId) {
        this.id = taskId;
    }
}
