import React, { useEffect, useState } from 'react'
import Task from './Task'
import { useDrop } from 'react-dnd';
export default function ListTasksHome() {
  const [tasks, setTasks] = useState([
    { id: 1, name_event: 'Event 1', host: 'teacher1@gmail.com', startDate: '11/12/2022', status: 'Todo' },
    { id: 2, name_event: 'Event 2', host: 'teacher2@gmail.com', startDate: '12/12/2022', status: 'Todo' },
    { id: 3, name_event: 'Event 3', host: 'teacher3@gmail.com', startDate: '13/12/2022', status: 'Todo' },
    { id: 4, name_event: 'Event 4', host: 'teacher4@gmail.com', startDate: '14/12/2022', status: 'Todo' },
    { id: 5, name_event: 'Event 5', host: 'teacher5@gmail.com', startDate: '15/12/2022', status: 'Todo' },
    { id: 6, name_event: 'Event 6', host: 'teacher6@gmail.com', startDate: '16/12/2022', status: 'Todo' },
    { id: 7, name_event: 'Event 7', host: 'teacher7@gmail.com', startDate: '17/12/2022', status: 'Todo' },
    { id: 8, name_event: 'Event 8', host: 'teacher8@gmail.com', startDate: '18/12/2022', status: 'Todo' },
    { id: 9, name_event: 'Event 9', host: 'teacher9@gmail.com', startDate: '19/12/2022', status: 'Todo' },
  ])

  // drop instances
  const [{ isOver: isOverTaskGoing }, dropTaskGoing] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'Going'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskTodo }, dropTaskTodo] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'Todo'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskDone }, dropTaskDone] = useDrop(() => ({
    accept: 'task',
    drop: (item) => updateTask(item, 'Done'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  // handle drop functions
  const updateTask = (task, status = 'Todo') => {
    setTasks(currentTasks => {
      const findIndexTask = currentTasks.findIndex(item => item.id === task.id);
      if (findIndexTask !== -1) {
        currentTasks[findIndexTask].status = status;
      }
      return currentTasks
    })
  }
  const get10LatestEvent = async () => {
    try {
      const urlGet10LatestEvent = 'https://www.googleapis.com/oauth2/v3/userinfo'
    } catch (error) {

    }
  }
  // call functions after this component mounted
  useEffect(() => {

  }, []);

  return (
    <>
      <div className='task-list'>
        <div className='tasks-todo' ref={dropTaskTodo}>
          <h3>Todo</h3>
          {(tasks.filter(task => task.status === 'Todo')).map((task) => {
            console.log(task)
            return <Task content={task.name_event} key={`task-todo-${task.id}`} taskId={task.id} task={task}></Task>
          })}
        </div>
        <div className='tasks-going' ref={dropTaskGoing}>
          <h3>Going</h3>
          {(tasks.filter(task => task.status === 'Going')).map((task) => {
            return <Task content={task.name_event} key={`task-going-${task.id}`} taskId={task.id} task={task}></Task>
          })}
        </div>
        <div className='tasks-going' ref={dropTaskDone}>
          <h3>Done</h3>
          {(tasks.filter(task => task.status === 'Done')).map((task) => {
            return <Task content={task.name_event} key={`task-going-${task.id}`} taskId={task.id} task={task}></Task>
          })}
        </div>
      </div>
    </>

  )
}