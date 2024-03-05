import React from 'react'
import { useDrop } from 'react-dnd'

export default function Drop({ content, taskId }) {
  return (
    <div ref={drag} className='task' id="taskId">{content}</div>
  )
}