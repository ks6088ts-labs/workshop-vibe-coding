import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <Stack direction="row" spacing={0.5}>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          }
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
              onChange={() => onToggle(task.id)}
              inputProps={{ 'aria-label': `toggle ${task.text}` }}
            />
          </ListItemIcon>

          <ListItemText
            primary={task.text}
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.disabled' : 'text.primary',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
