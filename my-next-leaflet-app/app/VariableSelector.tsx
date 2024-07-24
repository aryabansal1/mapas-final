import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Card, CardContent, Typography } from '@mui/material';

interface VariableSelectorProps {
  variables: { id: number; name: string }[];
  selectedVariables: number[];
  onVariableChange: (variableId: number, isChecked: boolean) => void;
  onCheckAll: () => void;
  onUncheckAll: () => void;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  variables,
  selectedVariables,
  onVariableChange,
  onCheckAll,
  onUncheckAll
}) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Select Variables
        </Typography>
        <FormGroup>
          <Button variant="contained" onClick={onCheckAll} sx={{ marginBottom: 1 }}>Check All</Button>
          <Button variant="contained" onClick={onUncheckAll} sx={{ marginBottom: 2 }}>Uncheck All</Button>
          {variables.map(variable => (
            <FormControlLabel
              key={variable.id}
              control={
                <Checkbox
                  checked={selectedVariables.includes(variable.id)}
                  onChange={(e) => onVariableChange(variable.id, e.target.checked)}
                />
              }
              label={variable.name}
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export default VariableSelector;
