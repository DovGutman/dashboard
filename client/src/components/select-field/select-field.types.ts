export type SelectOption<TValue extends string> = {
	value: TValue;
	label: string;
};

type BaseProps<TValue extends string> = {
	id: string;
	name: string;
	label: string;
	value: TValue;
	onChange: (value: TValue) => void;
	options: Array<SelectOption<TValue>>;
};

export type SelectFieldProps<TValue extends string> = BaseProps<TValue> & {
	includeAllOption?: boolean;
	allLabel?: string;
};
