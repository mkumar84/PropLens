import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({
  windowMs:    15 * 60 * 1000, // 15 min
  max:         50,
  message:     { error: 'Too many requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

export const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      10,
  message:  { error: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});
