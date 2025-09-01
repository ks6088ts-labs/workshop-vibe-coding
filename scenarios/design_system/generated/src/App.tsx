import { useEffect, useMemo, useRef, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import NewTaskForm from './components/NewTaskForm';
import TaskList from './components/TaskList';
import type { Task } from './types';

const STORAGE_KEY = 'mui-todo.tasks.v1';

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore write errors
    }
  }, [tasks]);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    const t: Task = { id: generateId(), text, completed: false, createdAt: Date.now() };
    setTasks((s) => [t, ...s]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id: string) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((s) => s.filter((t) => !t.completed));
  };

  const toggleAll = () => {
    const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
    setTasks((s) => s.map((t) => ({ ...t, completed: !allCompleted })));
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editingTask) return;
    const text = editText.trim();
    if (!text) {
      // if empty after edit, remove the task
      deleteTask(editingTask.id);
      setEditingTask(null);
      return;
    }
    setTasks((s) => s.map((t) => (t.id === editingTask.id ? { ...t, text } : t)));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            To Do (MUI)
          </Typography>
          <Tooltip title="Clear completed">
            <IconButton color="inherit" onClick={clearCompleted} aria-label="clear completed">
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <NewTaskForm
                value={input}
                onChange={setInput}
                onAdd={addTask}
                inputRef={inputRef}
                onKeyDown={handleInputKeyDown}
              />
            </Box>

            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1}>
                <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>
                  All
                </Button>
                <Button variant={filter === 'active' ? 'contained' : 'outlined'} onClick={() => setFilter('active')}>
                  Active
                </Button>
                <Button variant={filter === 'completed' ? 'contained' : 'outlined'} onClick={() => setFilter('completed')}>
                  Completed
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{remaining} left</Typography>
                <Button onClick={toggleAll}>Toggle all</Button>
              </Stack>
            </Stack>

            <Divider />

            <Box>
              {visibleTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No tasks — add one!
                </Typography>
              ) : (
                <TaskList tasks={visibleTasks} onToggle={toggleTask} onEdit={startEdit} onDelete={deleteTask} />
              )}
            </Box>
          </Stack>
        </Paper>
      </Container>

      <Dialog open={Boolean(editingTask)} onClose={cancelEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task"
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ position: 'fixed', right: 16, bottom: 16 }}>
        <Tooltip title="Focus input">
          <Fab color="primary" onClick={() => inputRef.current?.focus()} aria-label="add">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
}
