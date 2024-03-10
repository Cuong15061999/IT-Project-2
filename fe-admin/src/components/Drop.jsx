import React from 'react'

export default function Drop({ content, taskId }) {
  return (
    <div ref={drag} className='task' id="taskId">{content}</div>
  )
}