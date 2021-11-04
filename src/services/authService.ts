import BaseService from './index';

interface AuthGoogleResponse {
  token: string
}

interface GetInfoResponse {
  isMember: boolean,
  hasVoted: boolean,
}

const AuthService = {

  authGoogle(token: string) {
    return BaseService.post<AuthGoogleResponse>('auth/google', { token });
  },

  checkToken() {
    return BaseService.get<string>('auth/check');
  },

  getInfo() {
    return BaseService.get<GetInfoResponse>('auth/info');
  },
};

export default AuthService;
