import React from 'react';
import {
    TextField, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox,
    Slider, FormControl, FormHelperText,
    Typography
} from '@mui/material';

interface FieldProps {
    field: any;
    value: any;
    touched: boolean;
    onChange: (name: string, value: any) => void;
}

const Field: React.FC<FieldProps> = ({ field, value, touched, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (field.name === "phoneNumber") {

            const regex = /^[0-9\b]+$/;
            if ((newValue === '' || regex.test(newValue)) && newValue.length <= 10) {
                onChange(field.name, newValue);
            }
        } else {
            onChange(field.name, newValue);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        onChange(field.name, e.target.value as string);
    };

    const isError = field.required && touched && (!value || value.length === 0);

    const isPhoneNumberError =
        field.name === "phoneNumber" && touched && value.length !== 10;

    const isGraduationYearError =
        field.name === "graduationYear" && touched && (value < 1950 || value > 2024);



    switch (field.type) {
        case 'text':
            return (
                <TextField
                    fullWidth
                    label={field.label}
                    type={field.name === "phoneNumber" ? "tel" : field.type} // Use "tel" for phone number
                    name={field.name}
                    value={value}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={handleChange}
                    inputProps={{
                        maxLength: field.name === "phoneNumber" ? 10 : undefined,
                        inputMode: field.name === "phoneNumber" ? "numeric" : undefined,
                        pattern: field.name === "phoneNumber" ? "[0-9]*" : undefined,
                    }}
                    color="secondary"
                    focused
                    error={isError || isPhoneNumberError} // Show error for required and phone number validation
                    helperText={
                        isPhoneNumberError
                            ? "Please enter a valid mobile number (10 digits)"
                            : isError
                                ? `${field.label} is required`
                                : ''
                    }
                />
            )
        case 'number':
            return (
                <TextField
                    fullWidth
                    label={field.label}
                    type="number"
                    name={field.name}
                    value={value}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={handleChange}
                    inputProps={{
                        min: field.min,
                        max: field.max,
                    }}
                    color="secondary"
                    focused
                    error={isError || isGraduationYearError}
                    helperText={
                        isGraduationYearError
                            ? "Please enter a year between 1950 and 2024"
                            : isError
                                ? `${field.label} is required`
                                : ''
                    }
                />

            );

        case 'textarea':
            return (
                <TextField
                    fullWidth
                    label={field.label}
                    multiline
                    rows={4}
                    name={field.name}
                    value={value}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={handleChange}
                    color="secondary"
                    focused
                    error={isError} // Show error
                    helperText={isError ? `${field.label} is required` : ''} // Error message
                />
            );

        case 'dropdown':
            return (
                <FormControl fullWidth error={isError}>
                    <TextField
                        select
                        label={field.label}
                        value={value}
                        onChange={handleSelectChange}
                        color="secondary"
                        focused
                        error={isError}
                        helperText={isError ? `${field.label} is required` : ''}
                    >
                        {field.options.map((option: string, index: number) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
            );

        case 'radio':
            return (
                <FormControl component="fieldset" error={isError}>
                    <Typography color="secondary" gutterBottom>
                        {field.label}
                    </Typography>
                    <RadioGroup
                        row
                        name={field.name}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                    >
                        {field.options.map((option: any, index: number) => (
                            <FormControlLabel
                                key={index}
                                value={option.value}
                                control={<Radio color="secondary" />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                    {isError && <FormHelperText>{`${field.label} is required`}</FormHelperText>}
                </FormControl>

            );

        case 'checkbox':
            return (
                <FormControl component="fieldset" error={isError}>
                    <Typography color="secondary" gutterBottom>
                        {field.label}
                    </Typography>
                    {field.options.map((option: any, index: number) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={value.includes(option.value)}
                                    color='secondary'
                                    onChange={() => {
                                        onChange(
                                            field.name,
                                            value.includes(option.value)
                                                ? value.filter((v: any) => v !== option.value)
                                                : [...value, option.value]
                                        );
                                    }}
                                />
                            }
                            label={option.label}
                        />
                    ))}
                    {isError && <FormHelperText>{`${field.label} is required`}</FormHelperText>}
                </FormControl>
            );

        case 'slider':
            return (
                <div>
                    <label>{field.label}</label>
                    <Slider
                        value={value || field.min}
                        onChange={(e, newValue) => onChange(field.name, newValue)}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        color='secondary'
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                </div>
            );

        default:
            return null;
    }
};

export default Field;
