import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

// Versión mínima del selector de color.
export interface ColorTintProps {
	value?: string;            // Valor inicial/controlado
	onChange?: (hex: string) => void; // Callback al cambiar
}

// Estado global simple (último color seleccionado) + listeners para suscribir.
let lastColor = '#000000ff';
const listeners = new Set<(hex: string) => void>();

export const getCurrentTint = () => lastColor;
export const subscribeTint = (fn: (hex: string) => void) => { listeners.add(fn); return () => listeners.delete(fn); };

const ColorTint: React.FC<ColorTintProps> = ({ value, onChange}) => {
	const [color, setColor] = useState(value || lastColor);

	useEffect(() => { if (value && value !== color) setColor(value); }, [value, color]);

	const handleChange = (c: string) => {
		setColor(c);
		lastColor = c;
		onChange?.(c);
		listeners.forEach(l => { try { l(c); } catch { /* ignore */ } });
	};

	return (
		<div>
			<HexColorPicker color={color} onChange={handleChange} />
			<div className="ct-value" aria-label="Selected color" data-color={color}>{color}</div>
		</div>
	);
};

export default ColorTint;







 