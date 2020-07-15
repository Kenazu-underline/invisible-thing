import { uuid } from 'uuidv4';

function currentUserId(): string {
  let user = localStorage.getItem('findinvisiblethings_user');
  if (user === null) {
    user = uuid();
    localStorage.setItem('findinvisiblethings_user', String(user))
  }
  return user;
}


export default currentUserId;