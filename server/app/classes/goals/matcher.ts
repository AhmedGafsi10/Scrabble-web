import { Player } from '@app/classes/player';
import { GoalManager } from './goal-manager';
import { GoalTitle } from './goal-titles';

// David-Code-Review : le nom de cette classe n'est pas suffisament clair selon moi
// David-Code-Review : On pourrait rennomer cela pour GoalMatcher ou un truc dans le genre ?
export class Matcher {
    static goalManagers: GoalManager[];
    static notifyGoalManager(achiever: Player, goalTitle: GoalTitle, wordPoints?: number) {
        if (!this.checkRequestValidity(achiever)) return;
        this.goalManagers[achiever.managerId].registerGoalAchievement(goalTitle, achiever, wordPoints);
    }
    static registerManager(manager: GoalManager): number {
        if (this.goalManagers === undefined) this.goalManagers = [];
        if (this.goalManagers.includes(manager)) return this.goalManagers.findIndex((entry) => entry === manager);
        this.goalManagers.push(manager);
        return this.goalManagers.length - 1;
    }
    static checkRequestValidity(achiever: Player): boolean {
        if (!achiever || achiever.managerId === undefined) return false;
        if (this.checkIndexValidity(achiever.managerId)) return false;
        if (!this.goalManagers[achiever.managerId]) return false;
        return true;
    }
    static checkIndexValidity(index: number): boolean {
        return index > this.goalManagers.length - 1 || index < 0;
    }
}
