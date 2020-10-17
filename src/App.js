import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import StateContainer from './components/StateContainer';
import AddTaskModal from './components/AddTaskModal';
import { STATES } from './constants';

function App() {

	const [showAddTaskModal, setShowAddTaskModal] = useState(false);
	const [currentAddState, setCurrentAddState] = useState('');
	const [taskStateMapping, setTaskStateMapping] = useState({});
	const [taskIdIndexMap, setTaskIdIndexMap] = useState({});
	const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
	const [tasks, setTasks] = useState([])

	useEffect(()=>{
		let taskIndexMap = {};
		let taskMap = tasks.reduce((acc, task, index)=>{
			let _taskListForState = acc[task.state] || [];
			_taskListForState.push(task);
			acc[task.state] = _taskListForState;
			taskIndexMap[task.id] = index
			return acc;
		},{})

		setTaskStateMapping(taskMap)
		setTaskIdIndexMap(taskIndexMap)
	},[tasks])


	const toggleAddTaskModal = () => {
		let valueToSet = !showAddTaskModal;
		if(!valueToSet){
			setCurrentAddState('');
			setSelectedTaskIndex(null)
		}
		setShowAddTaskModal(valueToSet);
	}

	const handleAddUpdateTask = (task) => {
		if(taskIdIndexMap.hasOwnProperty(task.id)){
			let taskIndex = taskIdIndexMap[task.id];
			let _tasks = [...tasks];
			_tasks.splice(taskIndex,1,task)
			setTasks(_tasks)
		}else{
			setTasks([
				...tasks,
				task
			]);
		}
		toggleAddTaskModal();
	}

	const handleTaskEditClick = (taskId) => {
		let taskIndex = taskIdIndexMap[taskId];
		setSelectedTaskIndex(taskIndex);
		toggleAddTaskModal();
	}


	return (
		<div className={styles.appContainer}>
			{
				showAddTaskModal && <AddTaskModal
					onClose={toggleAddTaskModal}
					onAddTask={handleAddUpdateTask}
					currentAddState={currentAddState}
					task={tasks[selectedTaskIndex]}
				/>
			}
			<header className={styles.header}>
				<h3>Kanban Board</h3>
			</header>
			<div className={styles.content}>
				{
					Object.values(STATES).map((state) => {
						const handleAddClick = () => {
							setCurrentAddState(state);
							toggleAddTaskModal();
						}
						return <StateContainer 
									key={'state-'+state}
									name={state} 
									onAddClick={handleAddClick} 
									onTaskEditModeEnter={handleTaskEditClick} 
									tasksList={taskStateMapping[state]}
								/>
					})
				}
			</div>
		</div>
	);
}

export default App;
