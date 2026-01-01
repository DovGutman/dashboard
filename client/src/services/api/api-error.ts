export type ProblemDetailsDto = {
	type?: string | null;
	title?: string | null;
	status?: number | null;
	detail?: string | null;
	instance?: string | null;
	[key: string]: unknown;
};

export class ApiError extends Error {
	status: number;
	problemDetails?: ProblemDetailsDto;

	constructor(message: string, status: number, problemDetails?: ProblemDetailsDto) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.problemDetails = problemDetails;
	}
}
