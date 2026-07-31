function buildValidationError(field, message) {
  return { field, message };
}

function isValidIsoDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return false;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const isoDateString = parsedDate.toISOString();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return isoDateString.slice(0, 10) === trimmedValue;
  }

  return trimmedValue === isoDateString || trimmedValue === isoDateString.replace(".000Z", "Z");
}

function validateExpense(req, res, next) {
  const errors = [];
  const { title, amount, category, date } = req.body || {};

  if (typeof title !== "string") {
    errors.push(buildValidationError("title", "Title is required and must be a string."));
  } else if (!title.trim()) {
    errors.push(buildValidationError("title", "Title cannot be empty."));
  }

  if (amount === undefined || amount === null) {
    errors.push(buildValidationError("amount", "Amount is required."));
  } else if (typeof amount !== "number" || !Number.isFinite(amount)) {
    errors.push(buildValidationError("amount", "Amount must be a finite number."));
  } else if (amount <= 0) {
    errors.push(buildValidationError("amount", "Amount must be greater than zero."));
  }

  if (typeof category !== "string") {
    errors.push(buildValidationError("category", "Category is required and must be a string."));
  } else if (!category.trim()) {
    errors.push(buildValidationError("category", "Category cannot be empty."));
  }

  if (typeof date !== "string") {
    errors.push(buildValidationError("date", "Date is required and must be a valid ISO date string."));
  } else if (!isValidIsoDate(date)) {
    errors.push(buildValidationError("date", "Date must be a valid ISO date string."));
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body = {
    title: title.trim(),
    amount,
    category: category.trim(),
    date: date.trim(),
  };

  return next();
}

module.exports = validateExpense;
