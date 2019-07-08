import { ActionTypes } from 'const';

class UserAction {

  static setUser({ name, game }) {
    return {
      type: ActionTypes.SET_USER,
      name,      // User name
      game,      // Users current Gamestate
    }
  }

}

export default UserAction;

