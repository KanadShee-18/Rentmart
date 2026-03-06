export default {
  SUCCESS: `Operation has been successfull`,
  SOMETHING_WENT_WRONG: `Something went wrong`,
  NOT_FOUND: (entity: string) => `${entity} not found.`,
  TOO_MANY_REQUEST: `Too many requests. Try again after some time.`,
  ALREADY_EXISTS: (entity: string, identifier: string) =>
    `${entity} with ${identifier} already exists.`,
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Unauthorized access.',
}
