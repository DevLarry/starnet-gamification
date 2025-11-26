import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import './TaskList.css';
import TaskCard from './TaskCard';

const TaskList = () => {
  const { tasks, tasksLoading, completeTask, dailyCheckIn, user } = useAuth();
  const [completingTask, setCompletingTask] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  const handleDailyCheckIn = async () => {
    setCheckInLoading(true);
    const result = await dailyCheckIn();
    if (result.success) {
      alert(result.message || 'Check-in completed successfully!');
    } else {
      alert(
        result.error ||
          'Failed to check in. You may have already checked in today.',
      );
    }
    setCheckInLoading(false);
  };

  const handleCompleteTask = async (taskId) => {
    setCompletingTask(taskId);
    const result = await completeTask(taskId);
    if (!result.success) {
      alert(result.error || 'Failed to complete task');
    }
    setCompletingTask(null);
  };

  const handleInviteFriends = () => {
    alert(
      'Invite feature coming soon! Share with friends to earn bonus points.',
    );
  };

  const getTaskIcon = (task) => {
    if (task.icon) {
      return (
        <div className="task-icon">
          <img
            src={task.icon}
            alt={task.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="task-icon-fallback" style={{ display: 'none' }}>
            {getDefaultIcon(task.title)}
          </div>
        </div>
      );
    }
    return (
      <div className="task-icon">
        <div className="task-icon-fallback">{getDefaultIcon(task.title)}</div>
      </div>
    );
  };

  const getDefaultIcon = (title) => {
    if (title?.toLowerCase().includes('check')) return '📅';
    if (title?.toLowerCase().includes('invite')) return '👥';
    if (title?.toLowerCase().includes('profile')) return '👤';
    if (title?.toLowerCase().includes('social')) return '💬';
    return '✅';
  };

  const isTaskCompleted = (task) => {
    return (
      task.completions &&
      task.completions.some((completion) => completion.userId === user.id)
    );
  };

  // Separate special tasks
  const dailyCheckInTask = {
    id: 'daily-checkin',
    title: 'Daily Check-in',
    description: 'Check in daily to earn points and maintain your streak',
    pointValue: 5,
    type: 'checkin',
  };

  const inviteTask = {
    id: 'invite-friends',
    title: 'Invite Friends',
    description: 'Invite friends to join Starnet and earn bonus points',
    pointValue: 25,
    type: 'invite',
  };

  const regularTasks = tasks.filter(
    (task) =>
      !task.title?.toLowerCase().includes('check') &&
      !task.title?.toLowerCase().includes('invite'),
  );

  if (tasksLoading) {
    return (
      <div className="tasks-container">
        <LoadingSpinner message="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Daily Tasks</h2>
        <p>Complete tasks to earn points and level up!</p>
      </div>

      {/* Special Tasks Section */}
      <div className="special-tasks">
        {/* Daily Check-in Task */}
        <div
          className={`task-card special ${user.checkedInToday ? 'completed' : ''}`}
        >
          {getTaskIcon(dailyCheckInTask)}
          <div className="task-content">
            <h3>{dailyCheckInTask.title}</h3>
            <p>{dailyCheckInTask.description}</p>
            <div className="task-meta">
              <span className="task-points">
                +{dailyCheckInTask.pointValue} points
              </span>
              {user.streak > 0 && (
                <span className="streak-badge">
                  🔥 {user.streak} day streak
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleDailyCheckIn}
            disabled={checkInLoading || user.checkedInToday}
            className={`task-action ${user.checkedInToday ? 'completed' : 'primary'}`}
          >
            {checkInLoading ? (
              <>
                <div className="spinner-small"></div>
                Checking...
              </>
            ) : user.checkedInToday ? (
              '✅ Checked In'
            ) : (
              'Check In'
            )}
          </button>
        </div>

        {/* Invite Friends Task */}
        <div className="task-card special">
          {getTaskIcon(inviteTask)}
          <div className="task-content">
            <h3>{inviteTask.title}</h3>
            <p>{inviteTask.description}</p>
            <div className="task-meta">
              <span className="task-points">
                +{inviteTask.pointValue} points
              </span>
            </div>
          </div>
          <button
            onClick={handleInviteFriends}
            className="task-action secondary"
          >
            Invite
          </button>
        </div>
      </div>

      {/* Regular Tasks Section */}
      <div className="regular-tasks">
        <h3>Available Tasks</h3>
        {regularTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks available right now.</p>
            <p>Check back later for new tasks!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {regularTasks.map((task) => {
              const completed = isTaskCompleted(task);
              return (
                // <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} completed={completed} />
                // <div
                //   key={task.id}
                //   className={`task-card ${completed ? 'completed' : ''}`}
                // >
                //   {getTaskIcon(task)}
                //   <div className="task-content">
                //     <h3>{task.title}</h3>
                //     <p>{task.description}</p>
                //     <div className="task-meta">
                //       <span className="task-points">
                //         +{task.pointValue} points
                //       </span>
                //       {task.url && !completed && (
                //         <a
                //           href={task.url}
                //           target="_blank"
                //           rel="noopener noreferrer"
                //           className="task-link"
                //           onClick={(e) => e.stopPropagation()}
                //         >
                //           Visit Link
                //         </a>
                //       )}
                //     </div>
                //   </div>
                //   <button
                //     onClick={() => handleCompleteTask(task)}
                //     disabled={completingTask === task.id || completed}
                //     className={`task-action ${completed ? 'completed' : ''}`}
                //   >
                //     {completingTask === task.id ? (
                //       <>
                //         <div className="spinner-small"></div>
                //         Completing...
                //       </>
                //     ) : completed ? (
                //       '✅ Completed'
                //     ) : (
                //       'Complete'
                //     )}
                //   </button>
                // </div>
                <div className="task-card special">
                  {getTaskIcon(task)}
                  <div className="task-content">
                    <h3>{task?.title}</h3>
                    <p>{task?.description}</p>
                    <div className="task-meta">
                      <span className="task-points">
                        +{task.pointValue} points
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task)}
                    disabled={completingTask === task.id || completed}
                    className={`task-action secondary ${completed ? 'completed' : ''}`}
                  >
                    {completingTask === task.id ? (
                      <>
                        <div className="spinner-small"></div>
                        Completing...
                      </>
                    ) : completed ? (
                      '✅ Completed'
                    ) : (
                      'Complete'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
