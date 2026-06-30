export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  jti: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
