import React from 'react';
import cx from 'classnames';
import styles from './StateContainer.module.scss';
import noop from '../utils/noop';
import TaskCard from './TaskCard';

function StateContainer({
	name = '',
	onAddClick = noop,
	onTaskEditModeEnter = noop,
	tasksList = []
}) {
	return (
		<div className={styles.container}>
			<div className={styles.stateName}>{name}</div>

			{
				tasksList.length > 0 ?
					<>
						{
							tasksList.map((task) => {
								return <TaskCard key={'task-'+task.id} task={task} onEditModeEnter={onTaskEditModeEnter}/>
							})
						}
						<button className={cx('btn')} onClick={onAddClick}>
							Add another task +
						</button>
					</> : 
					<div className={styles.noTaskCard} onClick={onAddClick}>
						+ Add a new task
					</div>
			}
		</div>
	);
}

export default StateContainer;
