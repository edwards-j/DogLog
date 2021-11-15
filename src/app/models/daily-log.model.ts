import { Out } from './out.model';
import { Note } from './note.model';
import { Walk } from './walk.model';

export class DailyLog {
    dailyLogID?: string;
    date: number; // Unix time
    breakfast: number;
    dinner: number;
    outs?: Out[];
    walks?: Walk[];
    notes?: Note[];
}
