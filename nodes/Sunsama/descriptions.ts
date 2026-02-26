import type { INodeProperties } from 'n8n-workflow';

export const sunsamaNodeProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		default: 'task',
		options: [
			{
				name: 'Task',
				value: 'task',
			},
			{
				name: 'Subtask',
				value: 'subtask',
			},
			{
				name: 'User',
				value: 'user',
			},
			{
				name: 'Stream',
				value: 'stream',
			},
			{
				name: 'Calendar Event',
				value: 'calendarEvent',
			},
			{
				name: 'Utility',
				value: 'utility',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'taskOperation',
		type: 'options',
		noDataExpression: true,
		default: 'getByDay',
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Get Tasks By Day',
				value: 'getByDay',
				description: 'Retrieve tasks scheduled for a day',
				action: 'Get tasks by day',
			},
			{
				name: 'Get Backlog Tasks',
				value: 'getBacklog',
				description: 'Retrieve unscheduled backlog tasks',
				action: 'Get backlog tasks',
			},
			{
				name: 'Get Archived Tasks',
				value: 'getArchived',
				description: 'Retrieve archived tasks',
				action: 'Get archived tasks',
			},
			{
				name: 'Get Task By ID',
				value: 'getById',
				description: 'Retrieve a single task by ID',
				action: 'Get a task by ID',
			},
			{
				name: 'Create Task',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Delete Task',
				value: 'delete',
				description: 'Delete an existing task',
				action: 'Delete a task',
			},
			{
				name: 'Complete Task',
				value: 'complete',
				description: 'Mark task complete',
				action: 'Complete a task',
			},
			{
				name: 'Uncomplete Task',
				value: 'uncomplete',
				description: 'Mark task incomplete',
				action: 'Uncomplete a task',
			},
			{
				name: 'Update Task Text',
				value: 'updateText',
				description: 'Update task title/text',
				action: 'Update task text',
			},
			{
				name: 'Update Task Snooze Date',
				value: 'updateSnoozeDate',
				description: 'Schedule, reschedule, or move task to backlog',
				action: 'Update task snooze date',
			},
			{
				name: 'Update Task Planned Time',
				value: 'updatePlannedTime',
				description: 'Update estimated minutes',
				action: 'Update task planned time',
			},
			{
				name: 'Update Task Due Date',
				value: 'updateDueDate',
				description: 'Set or clear due date',
				action: 'Update task due date',
			},
			{
				name: 'Update Task Stream',
				value: 'updateStream',
				description: 'Assign task to a stream',
				action: 'Update task stream',
			},
			{
				name: 'Update Task Notes',
				value: 'updateNotes',
				description: 'Update task notes using HTML or Markdown',
				action: 'Update task notes',
			},
			{
				name: 'Reorder Task',
				value: 'reorder',
				description: 'Move task to position within a day',
				action: 'Reorder a task',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'subtaskOperation',
		type: 'options',
		noDataExpression: true,
		default: 'add',
		displayOptions: {
			show: {
				resource: ['subtask'],
			},
		},
		options: [
			{
				name: 'Add Subtask',
				value: 'add',
				description: 'Create a subtask with title',
				action: 'Add a subtask',
			},
			{
				name: 'Create Subtasks',
				value: 'createMany',
				description: 'Register one or more subtask IDs',
				action: 'Create subtasks',
			},
			{
				name: 'Update Subtask Title',
				value: 'updateTitle',
				description: 'Update title for an existing subtask',
				action: 'Update subtask title',
			},
			{
				name: 'Complete Subtask',
				value: 'complete',
				description: 'Mark subtask complete',
				action: 'Complete a subtask',
			},
			{
				name: 'Uncomplete Subtask',
				value: 'uncomplete',
				description: 'Mark subtask incomplete',
				action: 'Uncomplete a subtask',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'userOperation',
		type: 'options',
		noDataExpression: true,
		default: 'getCurrent',
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get Current User',
				value: 'getCurrent',
				action: 'Get current user',
			},
			{
				name: 'Get User Timezone',
				value: 'getTimezone',
				action: 'Get user timezone',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'streamOperation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: {
			show: {
				resource: ['stream'],
			},
		},
		options: [
			{
				name: 'Get All Streams',
				value: 'getAll',
				action: 'Get all streams',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'calendarOperation',
		type: 'options',
		noDataExpression: true,
		default: 'create',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
			},
		},
		options: [
			{
				name: 'Create Calendar Event',
				value: 'create',
				action: 'Create a calendar event',
			},
			{
				name: 'Update Calendar Event',
				value: 'update',
				action: 'Update a calendar event',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'utilityOperation',
		type: 'options',
		noDataExpression: true,
		default: 'generateTaskId',
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Generate Task ID',
				value: 'generateTaskId',
				action: 'Generate a task ID',
			},
		],
	},

	// Shared task/subtask fields
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '685022edbdef77163d659d4a',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: [
					'getById',
					'delete',
					'complete',
					'uncomplete',
					'updateText',
					'updateSnoozeDate',
					'updatePlannedTime',
					'updateDueDate',
					'updateStream',
					'updateNotes',
					'reorder',
				],
			},
		},
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '685022edbdef77163d659d4a',
		displayOptions: {
			show: {
				resource: ['subtask'],
			},
		},
	},
	{
		displayName: 'Limit Response Payload',
		name: 'taskLimitResponsePayload',
		type: 'boolean',
		default: true,
		description: 'Whether to return compact response payload',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: [
					'delete',
					'complete',
					'uncomplete',
					'updateText',
					'updateSnoozeDate',
					'updatePlannedTime',
					'updateDueDate',
					'updateStream',
					'updateNotes',
				],
			},
		},
	},

	// Task queries
	{
		displayName: 'Day',
		name: 'taskDay',
		type: 'string',
		required: true,
		default: '={{$now.toFormat("yyyy-LL-dd")}}',
		placeholder: '2026-02-25',
		description: 'Date in YYYY-MM-DD format',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['getByDay', 'reorder'],
			},
		},
	},
	{
		displayName: 'Timezone',
		name: 'taskTimezone',
		type: 'string',
		default: '',
		placeholder: 'America/Los_Angeles',
		description: 'Optional IANA timezone',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['getByDay', 'updateSnoozeDate', 'reorder'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'taskArchivedOffset',
		type: 'number',
		default: 0,
		description: 'Pagination offset',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['getArchived'],
			},
		},
		typeOptions: {
			minValue: 0,
		},
	},
	{
		displayName: 'Limit',
		name: 'taskArchivedLimit',
		type: 'number',
		default: 300,
		description: 'Maximum archived tasks to fetch',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['getArchived'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
	},

	// Task create
	{
		displayName: 'Text',
		name: 'createTaskText',
		type: 'string',
		required: true,
		default: '',
		description: 'Task title',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Custom Task ID',
		name: 'createTaskId',
		type: 'string',
		default: '',
		description: 'Optional 24-char hex task ID',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Notes',
		name: 'createTaskNotes',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Time Estimate (Minutes)',
		name: 'createTaskTimeEstimate',
		type: 'number',
		default: 0,
		description: 'Set 0 to skip setting a time estimate',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
		typeOptions: {
			minValue: 0,
		},
	},
	{
		displayName: 'Stream IDs',
		name: 'createStreamIds',
		type: 'multiOptions',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getStreams',
		},
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
		description: 'Assign task to one or more streams',
	},
	{
		displayName: 'Private',
		name: 'createTaskPrivate',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Due Date',
		name: 'createTaskDueDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Snooze Until',
		name: 'createTaskSnoozeUntil',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Integration JSON',
		name: 'createIntegrationJson',
		type: 'json',
		default: '',
		typeOptions: {
			rows: 6,
		},
		description: 'Optional task integration payload (GitHub, Gmail, etc.)',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['create'],
			},
		},
	},

	// Task updates
	{
		displayName: 'Was Task Merged',
		name: 'taskWasTaskMerged',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['delete'],
			},
		},
	},
	{
		displayName: 'Completed On',
		name: 'taskCompleteOn',
		type: 'dateTime',
		default: '',
		description: 'Optional completion timestamp',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['complete'],
			},
		},
	},
	{
		displayName: 'Text',
		name: 'taskUpdateText',
		type: 'string',
		required: true,
		default: '',
		description: 'Updated task text/title',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateText'],
			},
		},
	},
	{
		displayName: 'Recommended Stream ID',
		name: 'taskRecommendedStreamId',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getStreams',
		},
		description: 'Optional recommended stream assignment',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateText'],
			},
		},
	},
	{
		displayName: 'Move To Backlog',
		name: 'taskMoveToBacklog',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateSnoozeDate'],
			},
		},
		description: 'If enabled, task is unscheduled (new day becomes null)',
	},
	{
		displayName: 'New Day',
		name: 'taskSnoozeDay',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2026-02-25',
		description: 'Date in YYYY-MM-DD format',
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateSnoozeDate'],
				taskMoveToBacklog: [false],
			},
		},
	},
	{
		displayName: 'Time Estimate (Minutes)',
		name: 'taskTimeEstimate',
		type: 'number',
		required: true,
		default: 30,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updatePlannedTime'],
			},
		},
		typeOptions: {
			minValue: 0,
		},
	},
	{
		displayName: 'Clear Due Date',
		name: 'taskClearDueDate',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateDueDate'],
			},
		},
	},
	{
		displayName: 'Due Date',
		name: 'taskDueDate',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateDueDate'],
				taskClearDueDate: [false],
			},
		},
	},
	{
		displayName: 'Stream ID',
		name: 'taskStreamId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getStreams',
		},
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateStream'],
			},
		},
	},
	{
		displayName: 'Format',
		name: 'taskNotesFormat',
		type: 'options',
		default: 'markdown',
		options: [
			{
				name: 'Markdown',
				value: 'markdown',
			},
			{
				name: 'HTML',
				value: 'html',
			},
		],
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateNotes'],
			},
		},
	},
	{
		displayName: 'Notes Content',
		name: 'taskNotesContent',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['updateNotes'],
			},
		},
	},
	{
		displayName: 'Position',
		name: 'taskPosition',
		type: 'number',
		default: 0,
		required: true,
		description: '0-based index in day list',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				resource: ['task'],
				taskOperation: ['reorder'],
			},
		},
	},

	// Subtasks
	{
		displayName: 'Subtask ID',
		name: 'subtaskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subtask'],
				subtaskOperation: ['updateTitle', 'complete', 'uncomplete'],
			},
		},
	},
	{
		displayName: 'Subtask Title',
		name: 'subtaskTitle',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subtask'],
				subtaskOperation: ['add', 'updateTitle'],
			},
		},
	},
	{
		displayName: 'Subtask IDs',
		name: 'subtaskIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'id1,id2,id3',
		description: 'Comma-separated subtask IDs',
		displayOptions: {
			show: {
				resource: ['subtask'],
				subtaskOperation: ['createMany'],
			},
		},
	},
	{
		displayName: 'Completed Date',
		name: 'subtaskCompletedDate',
		type: 'dateTime',
		default: '',
		description: 'Optional completion timestamp',
		displayOptions: {
			show: {
				resource: ['subtask'],
				subtaskOperation: ['complete'],
			},
		},
	},
	{
		displayName: 'Limit Response Payload',
		name: 'subtaskLimitResponsePayload',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['subtask'],
				subtaskOperation: ['createMany', 'complete', 'uncomplete'],
			},
		},
	},

	// Calendar
	{
		displayName: 'Event ID',
		name: 'calendarEventId',
		type: 'string',
		default: '',
		description: 'Optional custom event ID',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Event ID',
		name: 'calendarEventId',
		type: 'string',
		required: true,
		default: '',
		description: 'Calendar event ID to update',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['update'],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'calendarTitle',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Start Date',
		name: 'calendarStartDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'calendarEndDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'calendarDescription',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Calendar ID',
		name: 'calendarCalendarId',
		type: 'string',
		default: '',
		description: 'Destination calendar ID (often an email address)',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Service',
		name: 'calendarService',
		type: 'options',
		default: 'google',
		options: [
			{
				name: 'Google',
				value: 'google',
			},
			{
				name: 'Microsoft',
				value: 'microsoft',
			},
		],
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Visibility',
		name: 'calendarVisibility',
		type: 'options',
		default: 'private',
		options: [
			{
				name: 'Private',
				value: 'private',
			},
			{
				name: 'Public',
				value: 'public',
			},
			{
				name: 'Default',
				value: 'default',
			},
			{
				name: 'Confidential',
				value: 'confidential',
			},
		],
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Transparency',
		name: 'calendarTransparency',
		type: 'options',
		default: 'opaque',
		options: [
			{
				name: 'Opaque',
				value: 'opaque',
			},
			{
				name: 'Transparent',
				value: 'transparent',
			},
		],
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'All Day',
		name: 'calendarIsAllDay',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Stream IDs',
		name: 'calendarStreamIds',
		type: 'multiOptions',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getStreams',
		},
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Seed Task ID',
		name: 'calendarSeedTaskId',
		type: 'string',
		default: '',
		description: 'Optionally link event to an existing task',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create'],
			},
		},
	},
	{
		displayName: 'Calendar Update JSON',
		name: 'calendarUpdateJson',
		type: 'json',
		required: true,
		default: '',
		typeOptions: {
			rows: 10,
		},
		description: 'Full CalendarEventUpdateData payload required by Sunsama',
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['update'],
			},
		},
	},
	{
		displayName: 'Invitee Status Update',
		name: 'calendarIsInviteeStatusUpdate',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['update'],
			},
		},
	},
	{
		displayName: 'Skip Reorder',
		name: 'calendarSkipReorder',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['update'],
			},
		},
	},
	{
		displayName: 'Limit Response Payload',
		name: 'calendarLimitResponsePayload',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['calendarEvent'],
				calendarOperation: ['create', 'update'],
			},
		},
	},

	// Utility
	{
		displayName: 'Count',
		name: 'generateTaskIdCount',
		type: 'number',
		default: 1,
		description: 'Number of IDs to generate',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['utility'],
				utilityOperation: ['generateTaskId'],
			},
		},
	},
];

