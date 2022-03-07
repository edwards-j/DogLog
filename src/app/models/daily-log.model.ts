import { DailyLogEvent } from './daily-log-event.model';
export class DailyLog {
    dailyLogID?: string;
    petID?: string;
    date: number; // Unix time
    eventTypes?: string[]
    events: DailyLogEvent[];
}
