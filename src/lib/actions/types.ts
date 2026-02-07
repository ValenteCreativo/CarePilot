// Action types for autonomous execution
export type ActionType = 'reminder' | 'message' | 'calendar' | 'checkin_prompt';

export type ActionStatus = 'pending' | 'approved' | 'executing' | 'completed' | 'failed';

export interface BaseAction {
  id: string;
  caseId: string;
  type: ActionType;
  status: ActionStatus;
  payload: Record<string, unknown>;
  scheduledFor?: Date;
  executedAt?: Date;
  approvedAt?: Date;
  failureReason?: string;
  opikTraceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderAction extends BaseAction {
  type: 'reminder';
  payload: {
    message: string;
    phoneNumber: string;
    actionDay: number;
    actionIndex: number;
  };
}

export interface MessageAction extends BaseAction {
  type: 'message';
  payload: {
    message: string;
    phoneNumber: string;
    purpose: string;
  };
}

export interface CalendarAction extends BaseAction {
  type: 'calendar';
  payload: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location?: string;
  };
}

export interface CheckinPromptAction extends BaseAction {
  type: 'checkin_prompt';
  payload: {
    message: string;
    phoneNumber: string;
    dayNumber: number;
  };
}

export type Action = ReminderAction | MessageAction | CalendarAction | CheckinPromptAction;

export interface ActionExecutionResult {
  success: boolean;
  executedAt: Date;
  message?: string;
  error?: string;
  externalId?: string; // Twilio SID, etc
}
