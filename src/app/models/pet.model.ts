import { DailyLog } from './daily-log.model';

export class Pet {
    petID?: string;
    petName: string;
    ownerEmail?: string;
    sharedWith?: string[];
    gender: string;
    species: string;
    birthday: number;
    dailyLogs?: DailyLog[];
    eventTypes?: string[];
}
