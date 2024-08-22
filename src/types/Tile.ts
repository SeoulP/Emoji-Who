export enum tileState {
	Active, Eliminated, Questioning
}

export type tile = {
	emoji: string;
	state: tileState;
	name: string;
};