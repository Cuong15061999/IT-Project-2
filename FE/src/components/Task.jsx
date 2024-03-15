import React from 'react'
import { useDrag } from 'react-dnd'

export default function Dnd({ className, content, taskId, task, onClick, notDrag }) {
  const [ { isDragging }, drag ] = useDrag(() => ({
    type: 'task',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  const dragRef = notDrag ? null : drag;
  return (
    <div ref={dragRef} className={className + ' task'} id={taskId} onClick={onClick}>{content}</div>
  )
}