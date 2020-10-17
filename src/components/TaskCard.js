import React, { useEffect, useState } from 'react';
import moment from 'moment';
import cx from 'classnames';
import styles from './TaskCard.module.scss';
import noop from '../utils/noop';
import { STATES } from '../constants';

function TaskCard({
	task = {},
	onEditModeEnter = noop
}) {
	const [colorCode,setColorCode] = useState('yellow');
	useEffect(()=>{
		if(task.state === STATES.DONE){
			if(moment(task.dueDate)<moment()){
				setColorCode('green')
			}
		}else{
			if(moment(task.dueDate)<moment()){
				setColorCode('red')
			}
		}
	},[task])

	const handleDoubleClick = () => {
		onEditModeEnter(task.id);
	}

	return (
		<div className={styles.container} onDoubleClick={handleDoubleClick}>
			<p className={styles.title}>
				{
					colorCode ? <span className={cx(styles.dot,styles[colorCode])}></span> : null
				}
				{task.title} 
			</p>
			<p className={styles.dueDate}>
				Due Date: {moment(task.dueDate).format('DD-MMM-YYYY')}
			</p>
			<div>
				{task.assignee?.name}
			</div>
		</div>
	);
}

export default TaskCard;
