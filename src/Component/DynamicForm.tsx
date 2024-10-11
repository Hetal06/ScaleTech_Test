import React, { useState, useEffect } from 'react';
import Field from './Field';
import { Grid, Button, Card, CardContent, Typography } from '@mui/material';
import { toast } from 'react-toastify';

interface FormProps {
    formConfig: any;
    initialData: any;
    onSubmit: (data: any) => void;
}

const DynamicForm: React.FC<FormProps> = ({ formConfig, initialData, onSubmit }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({}); // Track touched fields

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
        setTouchedFields({
            ...touchedFields,
            [name]: true,
        });
    };

    // const handleSubmit = (event: React.FormEvent) => {
    //     event.preventDefault();

    //     const allFieldsTouched: Record<string, boolean> = {};
    //     formConfig.form.groups.forEach((group: any) => {
    //         group.fields.forEach((field: any) => {
    //             allFieldsTouched[field.name] = true;
    //         });
    //     });
    //     setTouchedFields(allFieldsTouched); // Mark all fields as touched

    //     toast.success('Form submitted successfully!');
    //     onSubmit(formData);
    // };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Mark all fields as touched to trigger validation
        const allFieldsTouched: Record<string, boolean> = {};
        let formIsValid = true; // Track if the form is valid

        formConfig.form.groups.forEach((group: any) => {
            group.fields.forEach((field: any) => {
                allFieldsTouched[field.name] = true;

                // Check if the field is required and its value is missing or invalid
                if (field.required && (!formData[field.name] || formData[field.name].length === 0)) {
                    formIsValid = false; // Mark form as invalid if any required field is not filled
                }
            });
        });

        setTouchedFields(allFieldsTouched); // Mark all fields as touched

        if (formIsValid) {
            // If form is valid, submit the data
            toast.success('Form submitted successfully!');
            onSubmit(formData); // Call the onSubmit function with form data
        } else {
            // If form is not valid, show an error message
            toast.error('Please fill in all required fields before submitting.');
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={5} >
                {formConfig.form.groups.map((group: any, groupIndex: number) => (
                    <Grid item xs={12} key={groupIndex} >

                        <Card elevation={3} style={{ marginBottom: '20px' }}> {/* Apply card styling */}

                            <CardContent>
                                <Typography style={{ marginBottom: '20px' }} variant="h5" color="secondary" gutterBottom>
                                    {group.title}
                                </Typography>
                                <Grid container spacing={3} >
                                    {group.fields.map((field: any, fieldIndex: number) => (
                                        <Grid item xs={12} md={6} key={fieldIndex}>
                                            <Field
                                                field={field}
                                                value={formData[field.name] || ''}
                                                touched={touchedFields[field.name] || false} // Pass touched state
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button type="submit" variant="contained" color="secondary" >
                Submit
            </Button>
        </form>
    );
};

export default DynamicForm;
