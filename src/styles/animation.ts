import { keyframes } from '@emotion/css';

export const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const fadeInOut = keyframes({
  from: {
    opacity: 0,
  },
  '30%': {
    opacity: 1,
  },
  '70%': {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

export const smaller = (from: number | string, to: number | string) => (keyframes({
  from: {
    width: from,
  },
  to: {
    width: to,
  },
}));
