import React, { useEffect, useState } from 'react'
import Task from './Task'
import { useDrop } from 'react-dnd';
import axios from 'axios';
export default function ListTasksHome({ data }) {
  const [tasks, setTasks] = useState(data)

  // drop instances
  const [{ isOver: isOverTaskGoing }, dropTaskGoing] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'ongoing'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskTodo }, dropTaskTodo] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'todo'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskDone }, dropTaskDone] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'finished'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const callAPIUpdateTask = async (task) => {
    try {
      const urlUpdateTask = `http://localhost:3001/events/${task._id}`;
      const response = await axios.put(urlUpdateTask, task);
      if (response) {
        return true;
      }
      return false
    } catch (error) {
      console.log(error);
      return false
    }
  }

  // handle drop functions
  const updateTask = async (task, status = 'todo') => {
    const callApiUpdate = await callAPIUpdateTask({
      ...task,
      status
    });
    if (!callApiUpdate) {
      return;
    }
    setTasks((currentTasks) => {
      const updatedTasks = [...currentTasks];
      const findIndexTask = updatedTasks.findIndex(item => item._id === task._id);
  
      if (findIndexTask !== -1) {
        updatedTasks[findIndexTask].status = status;
      }
  
      return updatedTasks;
    });
  }

  return (
    <>
      <div className='task-list'>
        <div className='tasks-todo' ref={dropTaskTodo}>
          <h3>Todo</h3>
          {(tasks.filter(task => task.status?.toLowerCase() === 'todo')).map((task) => {
            return <Task content={task.name} key={`task-todo-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
        <div className='tasks-going' ref={dropTaskGoing}>
          <h3>Going</h3>
          {(tasks.filter(task => task.status?.toLowerCase() === 'ongoing')).map((task) => {
            return <Task content={task.name} key={`task-going-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
        <div className='tasks-going' ref={dropTaskDone}>
          <h3>Done</h3>
          {(tasks.filter(task => task.status?.toLowerCase() === 'finished')).map((task) => {
            return <Task content={task.name} key={`task-going-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
      </div>
    </>

  )
}