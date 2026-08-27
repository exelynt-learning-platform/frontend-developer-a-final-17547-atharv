/** User-facing messages shared by validation and API request handlers. */
export const APP_MESSAGES = {
  validation: {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    mobile: 'Mobile number must contain digits only.',
    tooLong: 'This value is too long.',
  },
  employee: {
    loadFailed: 'Failed to load employees.',
  },
  country: {
    loadFailed: 'Unable to load countries.',
  },
} as const;
