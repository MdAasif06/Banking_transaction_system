const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: "failed",
      errors: result.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

export default validate;
