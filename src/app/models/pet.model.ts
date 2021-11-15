import { DailyLog } from './daily-log.model';

export class Pet {
    petID: string;
    petName: string;
    ownerEmail: string;
    gender: string;
    species: string;
    dailyLogs?: DailyLog[];
}
