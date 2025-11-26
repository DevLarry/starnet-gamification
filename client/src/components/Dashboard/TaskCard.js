import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onComplete, completed }) => {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      await onComplete(task.id);
    } catch (error) {
      console.error('Error in task completion:', error);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        {task.icon && (
          <div className="task-icon">
            <span>{task.icon}</span>
          </div>
        )}
        <h3 className="task-title">{task.title}</h3>
        <div className="task-points">+{task.pointValue}</div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        {task.completed ? (
          <span className="completed-badge">Completed</span>
        ) : (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="complete-button"
          >
            {completing ? 'Completing...' : 'Complete Task'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
