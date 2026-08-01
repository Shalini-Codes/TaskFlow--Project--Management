/* ==========================================================================
   TaskFlow Form Validation Utilities
   ========================================================================== */

export function validateTaskForm(formData) {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Task title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!formData.status) {
    errors.status = 'Please select a valid status';
  }

  if (!formData.priority) {
    errors.priority = 'Please select a priority level';
  }

  if (formData.dueDate) {
    const selectedDate = new Date(formData.dueDate);
    if (isNaN(selectedDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateLoginForm(email, password) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
