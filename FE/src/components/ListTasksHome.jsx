import React from 'react'
import Task from './Task'
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../store/myTasks';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { setTabHomeSelected } from '../store/myTasks';

export default function ListTasksHome({ data }) {
  const tasks = useSelector((state) => state.my_tasks.tasks);
  const userLogin = useSelector((state) => state.user_login.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // drop instances
  const [{ isOver: isOverTaskGoing }, dropTaskGoing] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleUpdateTask(item, 'ongoing'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskTodo }, dropTaskTodo] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleUpdateTask(item, 'todo'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const [{ isOver: isOverTaskDone }, dropTaskDone] = useDrop(() => ({
    accept: 'task',
    drop: (item) => handleUpdateTask(item, 'finished'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  // handle drop functions
  const handleUpdateTask = async (task, status = 'todo') => {
    const newTask = {
      ...task,
      status
    }
    dispatch(updateTask(newTask));
  }

  const handleOpenEditModal = (task) => {
    if (userLogin.role === 'student') {
      return;
    }
    dispatch(setTabHomeSelected(1));
    navigate(`/event/${task._id}`)
  }

  return (
    <>
      <div className='task-list'>
        <div className='tasks-todo' ref={dropTaskTodo}>
          <h3>Todo</h3>
          {(tasks.map(item => ({
            ...item,
            startAt: moment(item.startAt),
            endAt: moment(item.endAt),
          })).filter(task => task.status?.toLowerCase() === 'todo')).map((task) => {
            return <Task notDrag={userLogin.role === 'student'} className="task-todo" onClick={() => handleOpenEditModal(task)} content={task.name} key={`task-todo-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
        <div className='tasks-going' ref={dropTaskGoing}>
          <h3>Going</h3>
          {(tasks.map(item => ({
            ...item,
            startAt: moment(item.startAt),
            endAt: moment(item.endAt),
          })).filter(task => task.status?.toLowerCase() === 'ongoing')).map((task) => {
            return <Task notDrag={userLogin.role === 'student'} className="task-going" onClick={() => handleOpenEditModal(task)} content={task.name} key={`task-going-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
        <div className='tasks-done' ref={dropTaskDone}>
          <h3>Done</h3>
          {(tasks.map(item => ({
            ...item,
            startAt: moment(item.startAt),
            endAt: moment(item.endAt),
          })).filter(task => task.status?.toLowerCase() === 'finished')).map((task) => {
            return <Task notDrag={true} className="task-done" onClick={() => handleOpenEditModal(task)} content={task.name} key={`task-going-${task._id}`} taskId={task._id} task={task}></Task>
          })}
        </div>
      </div>
    </>
  )
}