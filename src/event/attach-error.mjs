export const markEventListenerAttachError = (error) => {
  error.eventListenerAttach = true;
  return error;
};
