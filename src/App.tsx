import React, { useState } from 'react';
import './App.css';
import DynamicForm from './Component/DynamicForm';
import formConfig from './data/formData.json'; // Import the JSON
import { Card, CardContent, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('formData');
    return saved ? JSON.parse(saved) : {};
  });

  const handleSubmit = (data: any) => {
    localStorage.setItem('formData', JSON.stringify(data));
  };

  return (
    <Container maxWidth="lg" >
      <Card elevation={3} style={{ marginBottom: '20px' }} className='App-header'>
        <CardContent>
          <Typography variant="h3" color="secondary" gutterBottom>
            {formConfig.form.title}
          </Typography>
          <Typography variant="body1" color="secondary" gutterBottom>
            {formConfig.form.description}
          </Typography>
        </CardContent>
      </Card>

      <DynamicForm formConfig={formConfig} initialData={formData} onSubmit={handleSubmit} />
    </Container>
  );
};

export default App;
