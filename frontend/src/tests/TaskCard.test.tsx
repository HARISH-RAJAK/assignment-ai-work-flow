import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types/task';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    _id: '60d5ecb8b5c9c22b8c8b4567',
    userId: '60d5ecb8b5c9c22b8c8b1234',
    title: 'Automated Vitest Task',
    inputText: 'sample text payload',
    operationType: 'uppercase',
    status: 'Pending',
    logs: ['[2026-07-21T12:00:00Z] Task created with status Pending.'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders task title and status badge correctly', () => {
    const onRun = vi.fn();
    const onDelete = vi.fn();

    render(<TaskCard task={mockTask} onRun={onRun} onDelete={onDelete} />);

    expect(screen.getByText('Automated Vitest Task')).toBeDefined();
    expect(screen.getByText('Pending')).toBeDefined();
    expect(screen.getByText('uppercase')).toBeDefined();
  });

  it('triggers onRun callback when Run button is clicked', () => {
    const onRun = vi.fn();
    const onDelete = vi.fn();

    render(<TaskCard task={mockTask} onRun={onRun} onDelete={onDelete} />);

    const runBtn = screen.getByRole('button', { name: /run/i });
    fireEvent.click(runBtn);

    expect(onRun).toHaveBeenCalledWith(mockTask._id);
  });
});
