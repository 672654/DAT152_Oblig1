package no.hvl.dat152.tasklist.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import no.hvl.dat152.tasklist.enums.TaskStatuses;
import no.hvl.dat152.tasklist.model.Task;
import no.hvl.dat152.tasklist.model.TaskStatus;
import no.hvl.dat152.tasklist.repository.TaskRepository;
import no.hvl.dat152.tasklist.response.ResponseAddTask;
import no.hvl.dat152.tasklist.response.ResponseDeleteTask;
import no.hvl.dat152.tasklist.response.ResponseGetAllstatuses;
import no.hvl.dat152.tasklist.response.ResponseGetTask;
import no.hvl.dat152.tasklist.response.ResponseGetTasks;
import no.hvl.dat152.tasklist.response.ResponsePutTaskStatus;
import no.hvl.dat152.tasklist.response.ServerResponse;

@Controller
@RequestMapping(path = "/api")
public class TaskController {
  @Autowired
  private TaskRepository taskRepository;

  @Transactional
  @GetMapping(path = "/tasklist", produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse getTasks() {
    ResponseGetTasks response = new ResponseGetTasks();

    Iterable<Task> tasks = taskRepository.findAll();
    response.setTasks(tasks);
    response.setResponseStatus(true);

    return response;
  }

  @GetMapping(path = "/allstatuses", produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse getStatuses() {

    List<TaskStatuses> allstatuses = new ArrayList<>();
    for (TaskStatuses status : TaskStatuses.values()) {
      allstatuses.add(status);
    }
    ResponseGetAllstatuses response = new ResponseGetAllstatuses();
    response.setAllstatuses(allstatuses);
    response.setResponseStatus(true);

    return response;
  }

  @Transactional
  @PutMapping(path = "/task/{taskId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse UpdatedTaskStatuses(@PathVariable Integer taskId,
      @RequestBody TaskStatus status) {
    ResponsePutTaskStatus response = new ResponsePutTaskStatus();
    if ((taskId != null) && (status != null)) {
      Optional<Task> taskOpt = taskRepository.findById(taskId);
      if (taskOpt.isPresent()) {
        Task task = taskOpt.get();
        task.setStatus(status.getStatus());
        taskRepository.save(task);

        response.setId(taskId);
        response.setStatus(status.getStatus());
        response.setResponseStatus(true);
      }
    }

    return response;
  }

  @PostMapping(path = "/task", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse ResponseAddTask(@RequestBody Task task) {
    ResponseAddTask response = new ResponseAddTask();
    if (task != null) {
      Task savedTask = taskRepository.save(task);

      response.setTask(savedTask);
      response.setResponseStatus(true);
    }

    return response;
  }

  @Transactional
  @GetMapping(path = "/task/{taskId}", produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse getTask(@PathVariable Integer taskId) {
    ResponseGetTask getResponse = new ResponseGetTask();
    try {
      if (taskId != null) {
        if (taskId >= 1) {
          Optional<Task> taskOpt = taskRepository.findById(taskId);
          if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            getResponse.setTask(task);
            getResponse.setResponseStatus(true);
          }
        }
      }
    } catch (Exception e) {
      System.out.println(e);
    }

    return getResponse;
  }

  @Transactional
  @DeleteMapping(path = "/task/{taskId}", produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody ServerResponse deleteTask(@PathVariable Integer taskId) {
    ResponseDeleteTask deleteResponse = new ResponseDeleteTask();
    try {
      if (taskId != null) {
        if (taskId >= 1) {
          Optional<Task> taskOpt = taskRepository.findById(taskId);
          if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            taskRepository.delete(task);
            deleteResponse.setId(taskId);
            deleteResponse.setResponseStatus(true);
          }
        }
      }
    } catch (Exception e) {
      System.out.println(e);
    }

    return deleteResponse;
  }
}
