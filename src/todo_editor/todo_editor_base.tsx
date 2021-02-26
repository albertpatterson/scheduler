import React, { FunctionComponent, useState, useEffect } from 'react';
import { Todo } from '../types';
import TextField from '@material-ui/core/TextField';

export interface TodoEditorBaseProps {
  initialTodo?: Todo;
  handleTodoChange: (todo: Todo | null) => void;
}

interface TodoEditorBaseErrors {
  title?: string;
  description?: string;
  priority?: string;
  estimate?: string;
}

export const TEST_IDS = {
  todoEditorBaseTitleField: 'todoEditorBase_title_field',
  todoEditorBaseDescriptionField: 'todoEditorBase_description_field',
  todoEditorBasePriorityField: 'todoEditorBasePriorityField',
  todoEditorBaseEstimateField: 'todoEditorBaseEstimateField',
};

export const TodoEditorBase: FunctionComponent<TodoEditorBaseProps> = (
  props: TodoEditorBaseProps
) => {
  const [title, setTitle] = useState(props.initialTodo?.title || '');
  const [description, setDescription] = useState(
    props.initialTodo?.description || ''
  );
  const [priorityStr, setPrioiryStr] = useState(
    props.initialTodo?.priority.toString() || ''
  );
  const [estimateStr, setEstimateStr] = useState(
    props.initialTodo?.estimate.toString() || ''
  );

  const [errors, setErrors] = useState({} as TodoEditorBaseErrors);

  useEffect(() => {
    props.handleTodoChange(
      createTodo(title, description, priorityStr, estimateStr)
    );
  }, [title, description, priorityStr, estimateStr]);

  const handleTitleChange = (newTitle: string) => {
    const titleError = newTitle ? undefined : 'The title is required';
    setErrors((errors) => ({
      ...errors,
      title: titleError,
    }));
    setTitle(newTitle);
  };

  const handleDescriptionChange = (newDescription: string) => {
    const descriptionError = newDescription
      ? undefined
      : 'The description is required';
    setErrors((errors) => ({
      ...errors,
      description: descriptionError,
    }));

    setDescription(newDescription);
  };

  const handlePriorityChange = (newPriorityStr: string) => {
    let priorityError: string;
    const newPriority = parseRequiredNumber(newPriorityStr);
    if (newPriority === null) {
      priorityError = 'The priority is required';
    } else {
      if (isNaN(newPriority)) {
        priorityError = 'The priority must be a valid number';
      }

      setPrioiryStr(newPriorityStr);
    }

    setErrors((errors) => ({
      ...errors,
      priority: priorityError,
    }));
  };

  const handleEstimateChange = (newEstimateStr: string) => {
    let estimateError: string;
    const newEstimate = parseRequiredNumber(newEstimateStr);
    if (newEstimate === null) {
      estimateError = 'The estimate is required';
    } else {
      if (isNaN(newEstimate)) {
        estimateError = 'The estimate must be a valid number';
      } else if (newEstimate <= 0) {
        estimateError = 'The estimate must be a positive number';
      }
    }

    setErrors((errors) => ({
      ...errors,
      estimate: estimateError,
    }));

    setEstimateStr(newEstimateStr);
  };

  return (
    <>
      <TextField
        id="title"
        name="title"
        label="Title"
        fullWidth
        error={Boolean(errors.title)}
        helperText={errors.title}
        value={title}
        onChange={(event) => handleTitleChange(event.target.value)}
        data-testid={TEST_IDS.todoEditorBaseTitleField}
      />
      <TextField
        id="description"
        name="description"
        label="Description"
        fullWidth
        multiline
        rows={2}
        rowsMax={4}
        error={Boolean(errors.description)}
        helperText={errors.description}
        value={description}
        onChange={(event) => handleDescriptionChange(event.target.value)}
        data-testid={TEST_IDS.todoEditorBaseDescriptionField}
      />
      <TextField
        id="priority"
        name="priority"
        label="Priority"
        type="number"
        fullWidth
        error={Boolean(errors.priority)}
        helperText={errors.priority}
        value={priorityStr}
        onChange={(event) => handlePriorityChange(event.target.value)}
        data-testid={TEST_IDS.todoEditorBasePriorityField}
      />
      <TextField
        id="estimate"
        name="estimate"
        label="Estimate"
        type="number"
        fullWidth
        error={Boolean(errors.estimate)}
        helperText={errors.estimate}
        value={estimateStr}
        onChange={(event) => handleEstimateChange(event.target.value)}
        data-testid={TEST_IDS.todoEditorBaseEstimateField}
      />
    </>
  );
};

function createTodo(
  title?: string,
  description?: string,
  priorityStr?: string,
  estimateStr?: string
): Todo | null {
  if (!(title && description && priorityStr && estimateStr)) {
    return null;
  }

  const priority = parseRequiredNumber(priorityStr);
  const estimate = parseRequiredNumber(estimateStr);

  if (priority === null || estimate === null) {
    return null;
  }

  return { title, description, priority, estimate };
}

function parseRequiredNumber(numberStr?: string) {
  if (!numberStr) {
    return null;
  }

  return Number(numberStr);
}

export default TodoEditorBase;
