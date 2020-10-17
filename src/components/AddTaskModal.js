import React, { useState, useEffect } from 'react';
import moment from 'moment';
import cx from 'classnames';
import styles from './AddTaskModal.module.scss';
import noop from '../utils/noop';
import { members, STATES } from '../constants';

function AddTaskModal({
	onClose = noop,
	onAddTask = noop,
	task = null,
	currentAddState = ''
}) {

	const [formData, setFormData] = useState({
		title: '',
		dueDate: moment().format('YYYY-MM-DD'),
		state: currentAddState,
		assignee: ''
	});
	const [err, setErr] = useState('')
	const [membersMap] = useState(members.reduce((acc, member) => {
		acc[member.id] = member;
		return acc;
	}, {}))

	useEffect(() => {
		if(task){
			setFormData({
				title: task.title,
				dueDate: moment(task.dueDate).format('YYYY-MM-DD'),
				state: task.state,
				assignee: task?.assignee?.id
			})
		}
	}, [task])

	const handleInputChange = (e) => {
		const { name, value } = e?.target || {};
		setErr('')
		setFormData({
			...formData,
			[name]: value,
		})
	}
	const stopPropagation = (e) => {
		e.stopPropagation();
	}

	const handleSaveClick = () => {
		const taskDataToSave = {
			...formData,
			assignee: membersMap[formData.assignee],
		}
		for (const key in taskDataToSave) {
			if (!taskDataToSave[key]) {
				setErr(`${key} is required`);
				return;
			}
		}
		if(task){
			taskDataToSave['id'] = task?.id;
		}else{
			taskDataToSave['id'] = (new Date()).getTime();
		}
		console.log('>>>>>>saving this data', taskDataToSave);
		onAddTask(taskDataToSave)
	}

	return (
		<div className={styles.backDrop} onClick={onClose}>
			<div className={styles.container} onClick={stopPropagation}>
				<h2 className={styles.header}>
					{
						task ? 'Edit Task' : 'Add a Task'
					}
				</h2>
				<div className={styles.content}>
					<div className={styles.formGroup}>
						<label>Title</label>
						<input
							name='title'
							className={styles.input}
							value={formData.title}
							type='text'
							onChange={handleInputChange}
							placeholder='Title'
						/>
					</div>
					<div className={styles.formGroup}>
						<label>Due Date</label>
						<input
							name='dueDate'
							className={styles.input}
							value={formData.dueDate}
							type='date'
							onChange={handleInputChange}
							placeholder='Due Date'
							min={moment().format('YYYY-MM-DD')}
						/>
					</div>
					<div className={styles.formGroup}>
						<label>State</label>
						<select className={styles.input} name='state' value={formData.state} onChange={handleInputChange}>
							<option value='' disabled>Select a state</option>
							{
								Object.values(STATES).map((option => {
									return <option value={option}>{option}</option>
								}))
							}
						</select>
					</div>
					<div className={styles.formGroup}>
						<label>Assignee</label>
						<select className={styles.input} name='assignee' value={formData.assignee} onChange={handleInputChange}>
							<option value='' disabled>Select a member to assign task</option>
							{
								members.map((member => {
									return <option value={member.id}>{member.name}</option>
								}))
							}
						</select>
					</div>
					<div className={styles.error}>{err}</div>
				</div>
				<div className={styles.footer}>
					<button className={cx('btn')} onClick={onClose}>Cancel</button>
					<button className={cx('btn', 'btn_primary')} onClick={handleSaveClick}>Save</button>
				</div>
			</div>
		</div>
	);
}

export default AddTaskModal;
