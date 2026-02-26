import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { SunsamaClient } from 'sunsama-api';
import type {
	CalendarEventUpdateData,
	CreateCalendarEventOptions,
	CreateTaskOptions,
	TaskIntegration,
	TaskNotesContent,
	UpdateCalendarEventOptions,
} from 'sunsama-api';

import {
	ensureValue,
	getOptionalString,
	getStringList,
	parseJsonParameter,
} from './helpers';

type Resource = 'task' | 'subtask' | 'user' | 'stream' | 'calendarEvent' | 'utility';

export async function executeSunsamaOperation(
	context: IExecuteFunctions,
	client: SunsamaClient,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const resource = context.getNodeParameter('resource', itemIndex) as Resource;

	switch (resource) {
		case 'task':
			return await executeTaskOperation(context, client, itemIndex);
		case 'subtask':
			return await executeSubtaskOperation(context, client, itemIndex);
		case 'user':
			return await executeUserOperation(context, client, itemIndex);
		case 'stream':
			return await executeStreamOperation(client);
		case 'calendarEvent':
			return await executeCalendarEventOperation(context, client, itemIndex);
		case 'utility':
			return executeUtilityOperation(context, itemIndex);
		default:
			throw new NodeOperationError(context.getNode(), `Unsupported resource: ${resource}`, {
				itemIndex,
			});
	}
}

async function executeTaskOperation(
	context: IExecuteFunctions,
	client: SunsamaClient,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const operation = context.getNodeParameter('taskOperation', itemIndex) as string;

	switch (operation) {
		case 'getByDay': {
			const day = context.getNodeParameter('taskDay', itemIndex) as string;
			const timezone = getOptionalString(context, 'taskTimezone', itemIndex);
			const tasks = await client.getTasksByDay(day, timezone);
			return tasks as unknown as IDataObject[];
		}

		case 'getBacklog': {
			const tasks = await client.getTasksBacklog();
			return tasks as unknown as IDataObject[];
		}

		case 'getArchived': {
			const offset = context.getNodeParameter('taskArchivedOffset', itemIndex, 0) as number;
			const limit = context.getNodeParameter('taskArchivedLimit', itemIndex, 300) as number;
			const tasks = await client.getArchivedTasks(offset, limit);
			return tasks as unknown as IDataObject[];
		}

		case 'getById': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const task = await client.getTaskById(taskId);
			return {
				found: task !== null,
				task: task ?? null,
			} as IDataObject;
		}

		case 'create': {
			const text = context.getNodeParameter('createTaskText', itemIndex) as string;
			const options: CreateTaskOptions = {};

			const customTaskId = getOptionalString(context, 'createTaskId', itemIndex);
			const notes = getOptionalString(context, 'createTaskNotes', itemIndex);
			const timeEstimate = context.getNodeParameter(
				'createTaskTimeEstimate',
				itemIndex,
				undefined,
			) as number | undefined;
			const streamIds = getStringList(context, 'createStreamIds', itemIndex);
			const isPrivate = context.getNodeParameter('createTaskPrivate', itemIndex, false) as boolean;
			const dueDate = getOptionalString(context, 'createTaskDueDate', itemIndex);
			const snoozeUntil = getOptionalString(context, 'createTaskSnoozeUntil', itemIndex);
			const integrationInput = context.getNodeParameter(
				'createIntegrationJson',
				itemIndex,
				'',
			) as unknown;

			if (customTaskId) options.taskId = customTaskId;
			if (notes) options.notes = notes;
			if (typeof timeEstimate === 'number') options.timeEstimate = timeEstimate;
			if (streamIds) options.streamIds = streamIds;
			options.private = isPrivate;
			if (dueDate) options.dueDate = dueDate;
			if (snoozeUntil) options.snoozeUntil = snoozeUntil;
			if (typeof integrationInput === 'string' && integrationInput.trim().length > 0) {
				options.integration = parseJsonParameter<TaskIntegration>(
					context,
					'createIntegrationJson',
					itemIndex,
					'Integration JSON',
				);
			} else if (
				integrationInput &&
				typeof integrationInput === 'object' &&
				Object.keys(integrationInput as IDataObject).length > 0
			) {
				options.integration = integrationInput as TaskIntegration;
			}

			const result = await client.createTask(text, options);
			return result as unknown as IDataObject;
		}

		case 'delete': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const wasTaskMerged = context.getNodeParameter('taskWasTaskMerged', itemIndex, false) as boolean;
			const result = await client.deleteTask(taskId, limitResponsePayload, wasTaskMerged);
			return result as unknown as IDataObject;
		}

		case 'complete': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const completeOn = getOptionalString(context, 'taskCompleteOn', itemIndex);
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskComplete(taskId, completeOn, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'uncomplete': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskUncomplete(taskId, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'updateText': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const text = context.getNodeParameter('taskUpdateText', itemIndex) as string;
			const recommendedStreamId = getOptionalString(context, 'taskRecommendedStreamId', itemIndex);
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskText(taskId, text, {
				recommendedStreamId: recommendedStreamId ?? null,
				limitResponsePayload,
			});
			return result as unknown as IDataObject;
		}

		case 'updateSnoozeDate': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const moveToBacklog = context.getNodeParameter('taskMoveToBacklog', itemIndex, false) as boolean;
			const timezone = getOptionalString(context, 'taskTimezone', itemIndex);
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;

			const day = moveToBacklog
				? null
				: ensureValue(
						context,
						itemIndex,
						getOptionalString(context, 'taskSnoozeDay', itemIndex),
						'New Day',
				  );

			const result = await client.updateTaskSnoozeDate(taskId, day, {
				timezone,
				limitResponsePayload,
			});
			return result as unknown as IDataObject;
		}

		case 'updatePlannedTime': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const minutes = context.getNodeParameter('taskTimeEstimate', itemIndex) as number;
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskPlannedTime(taskId, minutes, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'updateDueDate': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const clearDueDate = context.getNodeParameter('taskClearDueDate', itemIndex, false) as boolean;
			const dueDate = clearDueDate
				? null
				: ensureValue(
						context,
						itemIndex,
						getOptionalString(context, 'taskDueDate', itemIndex),
						'Due Date',
				  );
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskDueDate(taskId, dueDate, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'updateStream': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const streamId = context.getNodeParameter('taskStreamId', itemIndex) as string;
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.updateTaskStream(taskId, streamId, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'updateNotes': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const format = context.getNodeParameter('taskNotesFormat', itemIndex) as 'html' | 'markdown';
			const notesContent = context.getNodeParameter('taskNotesContent', itemIndex) as string;
			const limitResponsePayload = context.getNodeParameter(
				'taskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;

			const content: TaskNotesContent =
				format === 'markdown' ? { markdown: notesContent } : { html: notesContent };

			const result = await client.updateTaskNotes(taskId, content, { limitResponsePayload });
			return result as unknown as IDataObject;
		}

		case 'reorder': {
			const taskId = context.getNodeParameter('taskId', itemIndex) as string;
			const day = context.getNodeParameter('taskDay', itemIndex) as string;
			const position = context.getNodeParameter('taskPosition', itemIndex) as number;
			const timezone = getOptionalString(context, 'taskTimezone', itemIndex);
			const result = await client.reorderTask(
				taskId,
				position,
				day,
				timezone ? { timezone } : undefined,
			);
			return result as unknown as IDataObject;
		}

		default:
			throw new NodeOperationError(
				context.getNode(),
				`Unsupported task operation: ${operation}`,
				{
					itemIndex,
				},
			);
	}
}

async function executeSubtaskOperation(
	context: IExecuteFunctions,
	client: SunsamaClient,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const operation = context.getNodeParameter('subtaskOperation', itemIndex) as string;
	const taskId = context.getNodeParameter('taskId', itemIndex) as string;

	switch (operation) {
		case 'add': {
			const title = context.getNodeParameter('subtaskTitle', itemIndex) as string;
			const result = await client.addSubtask(taskId, title);
			return result as unknown as IDataObject;
		}

		case 'createMany': {
			const subtaskIds = getStringList(context, 'subtaskIds', itemIndex);
			if (!subtaskIds || subtaskIds.length === 0) {
				throw new NodeOperationError(context.getNode(), 'At least one Subtask ID is required.', {
					itemIndex,
				});
			}
			const limitResponsePayload = context.getNodeParameter(
				'subtaskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.createSubtasks(taskId, subtaskIds, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		case 'updateTitle': {
			const subtaskId = context.getNodeParameter('subtaskId', itemIndex) as string;
			const title = context.getNodeParameter('subtaskTitle', itemIndex) as string;
			const result = await client.updateSubtaskTitle(taskId, subtaskId, title);
			return result as unknown as IDataObject;
		}

		case 'complete': {
			const subtaskId = context.getNodeParameter('subtaskId', itemIndex) as string;
			const completedDate = getOptionalString(context, 'subtaskCompletedDate', itemIndex);
			const limitResponsePayload = context.getNodeParameter(
				'subtaskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.completeSubtask(
				taskId,
				subtaskId,
				completedDate,
				limitResponsePayload,
			);
			return result as unknown as IDataObject;
		}

		case 'uncomplete': {
			const subtaskId = context.getNodeParameter('subtaskId', itemIndex) as string;
			const limitResponsePayload = context.getNodeParameter(
				'subtaskLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;
			const result = await client.uncompleteSubtask(taskId, subtaskId, limitResponsePayload);
			return result as unknown as IDataObject;
		}

		default:
			throw new NodeOperationError(
				context.getNode(),
				`Unsupported subtask operation: ${operation}`,
				{
					itemIndex,
				},
			);
	}
}

async function executeUserOperation(
	context: IExecuteFunctions,
	client: SunsamaClient,
	itemIndex: number,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('userOperation', itemIndex) as string;

	switch (operation) {
		case 'getCurrent':
			return (await client.getUser()) as unknown as IDataObject;
		case 'getTimezone': {
			const timezone = await client.getUserTimezone();
			return { timezone };
		}
		default:
			throw new NodeOperationError(context.getNode(), `Unsupported user operation: ${operation}`, {
				itemIndex,
			});
	}
}

async function executeStreamOperation(client: SunsamaClient): Promise<IDataObject[]> {
	const streams = await client.getStreamsByGroupId();
	return streams as unknown as IDataObject[];
}

async function executeCalendarEventOperation(
	context: IExecuteFunctions,
	client: SunsamaClient,
	itemIndex: number,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('calendarOperation', itemIndex) as string;

	switch (operation) {
		case 'create': {
			const title = context.getNodeParameter('calendarTitle', itemIndex) as string;
			const startDate = context.getNodeParameter('calendarStartDate', itemIndex) as string;
			const endDate = context.getNodeParameter('calendarEndDate', itemIndex) as string;
			const options: CreateCalendarEventOptions = {};

			const eventId = getOptionalString(context, 'calendarEventId', itemIndex);
			const description = getOptionalString(context, 'calendarDescription', itemIndex);
			const calendarId = getOptionalString(context, 'calendarCalendarId', itemIndex);
			const streamIds = getStringList(context, 'calendarStreamIds', itemIndex);
			const seedTaskId = getOptionalString(context, 'calendarSeedTaskId', itemIndex);
			const isAllDay = context.getNodeParameter('calendarIsAllDay', itemIndex, false) as boolean;
			const service = context.getNodeParameter('calendarService', itemIndex, 'google') as
				| 'google'
				| 'microsoft';
			const visibility = context.getNodeParameter('calendarVisibility', itemIndex, 'private') as
				| 'private'
				| 'public'
				| 'default'
				| 'confidential';
			const transparency = context.getNodeParameter('calendarTransparency', itemIndex, 'opaque') as
				| 'opaque'
				| 'transparent';
			const limitResponsePayload = context.getNodeParameter(
				'calendarLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;

			if (eventId) options.eventId = eventId;
			if (description) options.description = description;
			if (calendarId) options.calendarId = calendarId;
			if (streamIds) options.streamIds = streamIds;
			if (seedTaskId) options.seedTaskId = seedTaskId;
			options.isAllDay = isAllDay;
			options.service = service;
			options.visibility = visibility;
			options.transparency = transparency;
			options.limitResponsePayload = limitResponsePayload;

			const result = await client.createCalendarEvent(title, startDate, endDate, options);
			return result as unknown as IDataObject;
		}

		case 'update': {
			const eventId = context.getNodeParameter('calendarEventId', itemIndex) as string;
			const update = parseJsonParameter<CalendarEventUpdateData>(
				context,
				'calendarUpdateJson',
				itemIndex,
				'Calendar Update JSON',
			);
			const isInviteeStatusUpdate = context.getNodeParameter(
				'calendarIsInviteeStatusUpdate',
				itemIndex,
				false,
			) as boolean;
			const skipReorder = context.getNodeParameter('calendarSkipReorder', itemIndex, true) as boolean;
			const limitResponsePayload = context.getNodeParameter(
				'calendarLimitResponsePayload',
				itemIndex,
				true,
			) as boolean;

			const options: UpdateCalendarEventOptions = {
				isInviteeStatusUpdate,
				skipReorder,
				limitResponsePayload,
			};

			const result = await client.updateCalendarEvent(eventId, update, options);
			return result as unknown as IDataObject;
		}

		default:
			throw new NodeOperationError(
				context.getNode(),
				`Unsupported calendar operation: ${operation}`,
				{
					itemIndex,
				},
			);
	}
}

function executeUtilityOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject | IDataObject[] {
	const operation = context.getNodeParameter('utilityOperation', itemIndex) as string;

	switch (operation) {
		case 'generateTaskId': {
			const count = context.getNodeParameter('generateTaskIdCount', itemIndex, 1) as number;
			const generated = Array.from({ length: count }).map(() => ({
				taskId: SunsamaClient.generateTaskId(),
			}));
			return generated as IDataObject[];
		}

		default:
			throw new NodeOperationError(
				context.getNode(),
				`Unsupported utility operation: ${operation}`,
				{
					itemIndex,
				},
			);
	}
}

