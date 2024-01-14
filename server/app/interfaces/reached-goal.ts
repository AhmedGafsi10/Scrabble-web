import { GoalTitle } from '@app/classes/goals/goal-titles';

export interface ReachedGoal {
    title: GoalTitle;
    playerName: string;
    reward: number;
    communicated: boolean;
}
