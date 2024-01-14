import { Player } from '@app/classes/player';
import { GoalDescription } from './goal-descriptions';
import { GoalRewards, GoalTitle } from './goal-titles';

export interface Goal {
    title: GoalTitle;
    description: GoalDescription;
    reward: GoalRewards;
    reached: boolean;
    isPublic: boolean;
    players: Player[];
}
