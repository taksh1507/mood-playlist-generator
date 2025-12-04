export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.message,
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      details: err.message,
    });
  }

  if (err.message.includes('only MP3 and WAV')) {
    return res.status(400).json({
      error: 'Invalid file type',
      details: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
  });
};
