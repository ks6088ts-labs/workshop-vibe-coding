import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  inputRef: React.Ref<HTMLInputElement> | null;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function NewTaskForm({ value, onChange, onAdd, inputRef, onKeyDown }: Props) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
      <TextField
        inputRef={inputRef}
        fullWidth
        label="Add a task"
        placeholder="What do you need to do?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button variant="contained" onClick={onAdd} startIcon={<AddIcon />}>
        Add
      </Button>
    </Stack>
  );
}
