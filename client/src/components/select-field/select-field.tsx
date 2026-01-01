import type { SelectFieldProps } from './select-field.types';

export function SelectField<TValue extends string>({
	id,
	name,
	label,
	value,
	onChange,
	options,
	includeAllOption,
	allLabel,
}: SelectFieldProps<TValue>) {
	return (
		<div>
			<label htmlFor={id}>
				<strong>{label}</strong>
			</label>
			<select
				id={id}
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value as TValue)}
			>
				{includeAllOption ? <option value={'All' as TValue}>{allLabel ?? 'All'}</option> : null}
				{options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
		</div>
	);
}
