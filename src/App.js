import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import HackerEffect from './HackerEffect';
import './App.css'

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '5px',

  ...draggableStyle,
});

const getListStyle = () => ({
  padding: '10px',
  margin: '10px',
  width: '100%',
  height: '100%',
});

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {

      return JSON.parse(storedTasks);
    } else {

      return [];
    }
  });
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState('');
  const [editingTaskContent, setEditingTaskContent] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleNewTaskSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      const newTaskId = `${Object.keys(tasks).length + 1}`;
      setTasks({
        ...tasks,
        [newTaskId]: { id: newTaskId, content: newTask.trim() },
      });
    }

    setNewTask('');
  };

  const handleUpdateTask = (id, content) => {
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        content: content,
      },
    });
    setEditingTaskId('');
    setEditingTaskContent('');
  };

  const handleDeleteTask = (taskId) => {

    const { [taskId]: deletedTask, ...remainingTasks } = tasks;

    const updatedTasks = Object.values(remainingTasks).reduce((result, task, index) => {
      const taskId = (index + 1).toString();
      result[taskId] = { ...task, id: taskId };
      return result;
    }, {});

    setTasks(updatedTasks);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskContent(task.content);
  };

  const handleCancelEdit = () => {
    setEditingTaskId('');
    setEditingTaskContent('');
  };

  const handleToggleComplete = (id) => {
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        completed: !tasks[id].completed,
      },
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Object.values(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedTasks = {};
    items.forEach((item, index) => {
      reorderedTasks[index] = {
        ...item,
        id: index.toString(),
      };
    });

    setTasks(reorderedTasks);
  };

  return (
    <>
      <HackerEffect text="todo's." /><hr />
      <div className='container'>
        <div className='col-1'>
          <HackerEffect text="What is todo’s?" tag='h2' />
          <h5 className='subtitle'>"todo's. is a powerful digital tool that helps you stay organized and on top of your tasks.
            With todo's., you can easily create to-do lists, add and manage tasks,
            and track your progress towards completing your goals. Whether you're managing work projects,
            household chores, or personal errands, todo's. makes it easy to stay focused and productive."
          </h5> <br />
          <HackerEffect text="Capabilities of todo’s." tag='h2' />

          <ul className='unlist'>
            <li className='list'> <span className='highlight'> Create, edit, and delete tasks: </span> With todo's, you can easily create new tasks, edit existing ones, and delete tasks when they are no longer needed. </li>

            <li className='list'> <span className='highlight'> Mark tasks as complete: </span> When you finish a task, todo's allows you to mark it as complete, helping you to stay organized and track your progress. </li>

            <li className='list'> <span className='highlight'> Drag-and-drop functionality: </span> todo's allows you to drag and drop tasks, making it easy to reorder and prioritize your to-do list according to your needs. </li>

            <li className='list'> <span className='highlight'> Line-through for completed tasks: </span> When you mark a task as complete, todo's will add a line-through to the task to visually indicate that it has been completed. </li>

            <li className='list'> <span className='highlight'> Cross-platform accessibility: </span> todo's is accessible across multiple devices and platforms, allowing you to manage your tasks seamlessly whether you are at your desk, on your phone, or on the go. </li>
          </ul>

          <div className='contact-icon'>
            <a href="mailto:panuwat.pis@ku.th" className='icon'>
              <i className='bx bxl-gmail' ></i>
              <span>
                panuwat.pis@ku.th
              </span>
            </a>

            <a href='https://github.com/ballpanuwat25' className='icon'>
              <i className='bx bxl-github' ></i>
              <span>
                https://github.com/ballpanuwat25
              </span>
            </a>

            <a href='https://www.facebook.com/BallPanuwat00' className='icon'>
              <i className='bx bxl-facebook-circle' ></i>
              <span>
                https://www.facebook.com/BallPanuwat00
              </span>
            </a>
          </div>
        </div>

        <div className='col-2'>
          <div className='input'>
            <h3>To-do List 📌</h3>
            <form onSubmit={handleNewTaskSubmit}>
              <input placeholder='Add your new task here!'
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button type="submit" className='button-add' > <i className='bx bx-plus'></i> </button>
            </form>

          </div> <br />

          <div className='display'>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided, snapshot) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {Object.values(tasks).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <li data={task.id} className="task-list">
                              {editingTaskId === task.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={editingTaskContent}
                                    onChange={(e) =>
                                      setEditingTaskContent(e.target.value)
                                    }
                                  />
                                  <button className='button-update'
                                    onClick={() =>
                                      handleUpdateTask(task.id, editingTaskContent)
                                    }
                                  >
                                    Update
                                  </button>
                                  <button className='button-cancel'
                                    onClick={() => handleCancelEdit()}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <div key={task.id} style={{ textDecoration: task.completed ? "1px solid red line-through" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span> {task.content} </span>
                                  <div className='button-group'>
                                    <button className='button-complete' onClick={() => handleToggleComplete(task.id)}> Done </button>
                                    <button className='button-edit' onClick={() => handleEditTask(task)}> <i className='bx bx-pencil' ></i> </button>
                                    <button className='button-delete' onClick={() => handleDeleteTask(task.id)}> <i className='bx bx-trash'></i> </button>
                                  </div>
                                </div>
                              )}
                            </li>
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>

          </div>
        </div>
        <div className='hidden-icon'>
          <a href="mailto:panuwat.pis@ku.th" className='hdicon'>
            <i className='bx bxl-gmail' ></i>
          </a>

          <a href='https://github.com/ballpanuwat25/todo-s' className='hdicon'>
            <i className='bx bxl-github' ></i>
          </a>

          <a href='https://www.facebook.com/BallPanuwat00' className='hdicon'>
            <i className='bx bxl-facebook-circle' ></i>
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
