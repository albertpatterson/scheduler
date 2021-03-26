import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { SELECTORS } from 'store/selectors';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

enum ErrorType {
  load,
  save,
}

interface ErrorWithType {
  error?: string;
  errorType: ErrorType;
}

export const ErrorSnackbar: FunctionComponent = () => {
  const [errors, setErrors] = useState<ErrorWithType[]>([]);

  const loadScheduledTodosError = useSelector(SELECTORS.schedule.loadError);
  const saveScheduledTodosError = useSelector(SELECTORS.schedule.saveError);

  useEffect(() => {
    setErrors((errors) =>
      addNewError(errors, ErrorType.load, loadScheduledTodosError)
    );
  }, [loadScheduledTodosError]);

  useEffect(() => {
    setErrors((errors) =>
      addNewError(errors, ErrorType.save, saveScheduledTodosError)
    );
  }, [saveScheduledTodosError]);

  const error = errors.length > 0 ? errors[0].error : undefined;

  const open = Boolean(error);

  const handleClose = () => {
    setErrors((errors) => errors.slice(1));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        message={error}
        autoHideDuration={5000}
        onClose={handleClose}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      ></Snackbar>
    </>
  );
};

function addNewError(
  errors: ErrorWithType[],
  newErrorType: ErrorType,
  newError?: string
) {
  const filtered = errors.filter((error) => error.errorType !== newErrorType);

  if (newError) {
    const newErrorWithType = {
      error: newError,
      errorType: newErrorType,
    };

    return [newErrorWithType, ...filtered];
  }

  return filtered;
}

export default ErrorSnackbar;
