import React from 'react'
import { useDrag } from 'react-dnd'

export default function Dnd({ content, taskId, task }) {
  const [ { isDragging }, drag ] = useDrag(() => ({
    type: 'task',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <div ref={drag} className='task' id={taskId}>{content}</div>
  )
}