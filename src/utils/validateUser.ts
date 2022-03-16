export function validateUser(req) {
  const user = req.currentUser;
  if (!user) {
    throw new Error('You must be authenticated');
  }

  return user;
}
