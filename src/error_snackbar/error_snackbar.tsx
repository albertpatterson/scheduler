import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { ERROR_SELECTORS, ErrorSelector } from 'store/selectors';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface ErrorWithSelector {
  error?: string;
  errorSelector: ErrorSelector;
}

export const ErrorSnackbar: FunctionComponent = () => {
  const [errors, setErrors] = useState<ErrorWithSelector[]>([]);

  for (const key of Object.keys(ERROR_SELECTORS)) {
    const selector = ERROR_SELECTORS[key];
    const error = useSelector(selector);
    useEffect(() => {
      setErrors((errors) => addNewError(errors, selector, error));
    }, [error]);
  }

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
  errors: ErrorWithSelector[],
  selector: ErrorSelector,
  newError?: string
) {
  const filtered = errors.filter((error) => error.errorSelector !== selector);

  if (newError) {
    const newErrorWithType: ErrorWithSelector = {
      error: newError,
      errorSelector: selector,
    };

    return [newErrorWithType, ...filtered];
  }

  return filtered;
}

export default ErrorSnackbar;
