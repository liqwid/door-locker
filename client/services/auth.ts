import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { Injectable } from 'react.di'

import * as auth0 from 'auth0-js'

import { history } from 'services/history'

export type AUTH_STATUS = LOADING | AUTHENTICATED | UNAUTHENTICATED

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const EXPIRES_AT_KEY = 'expires_at'

const CLIENT_DOMAIN = <string> process.env.REACT_APP_AUTH0_DOMAIN
const CLIENT_ID = <string> process.env.REACT_APP_AUTH0_CLIENT_ID
const REDIRECT = `${process.env.REACT_APP_URL}callback`
const AUDIENCE = <string> process.env.REACT_APP_AUDIENCE
const RESPONSE_TYPE = 'token id_token'
const SCOPE = `openid profile email roles`

const HOME_ROUTE = '/'

type LOADING = string
type AUTHENTICATED = string
type UNAUTHENTICATED = string

export const LOADING: LOADING = 'loading'
export const AUTHENTICATED: AUTHENTICATED = 'authenticated'
export const UNAUTHENTICATED: UNAUTHENTICATED = 'unauthenticated'

const LOGIN_OPTIONS = {
  domain: CLIENT_DOMAIN,
  clientID: CLIENT_ID,
  redirectUri: REDIRECT,
  audience: AUDIENCE,
  responseType: RESPONSE_TYPE,
  scope: SCOPE
}

export interface UserProfile extends auth0.Auth0UserProfile {
  isAdmin: boolean
}

@Injectable
export class AuthService {
  private authState: BehaviorSubject<AUTH_STATUS> = new BehaviorSubject(LOADING)
  private accessTokenState: BehaviorSubject<string> = new BehaviorSubject('')
  private currentUserDataState: BehaviorSubject<UserProfile | null> = new BehaviorSubject(null)
  private tokenRenewalTimeout: number
  
  private auth = new auth0.WebAuth(LOGIN_OPTIONS)

  public initialize() {
    if (/access_token|id_token|error/.test(window.location.hash)) {
      this.auth.parseHash(this.onAuth)
      return
    }

    this.updateAuthState()
  }

  public getAuthStatusStream() {
    return this.authState.asObservable()
  }

  public getAcessTokenStream() {
    return this.accessTokenState.asObservable()
  }

  public getCurrentUserDataStream() {
    return this.currentUserDataState.asObservable()
  }

  public logout = () => {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ID_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    // navigate to the home route
    history.replace(HOME_ROUTE)
    
    this.authState.next(UNAUTHENTICATED)
    this.accessTokenState.next('')

    clearTimeout(this.tokenRenewalTimeout)
    this.login()
  }

  public login = () => {
    this.auth.authorize()
  }

  public renewToken() {
    this.auth.checkSession({}, this.onAuth)
  }

  private onAuth = (err: auth0.Auth0Error | null, authResult: auth0.Auth0DecodedHash) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      this.setSession(authResult)
      this.updateAuthState()
      return
    }
    // TODO: show logout notification with error and logout after a short timeout
    this.logout()
  }

  private setSession(authResult: auth0.Auth0DecodedHash) {
    // Set the time that the Access Token will expire at
    const expireTime = (<number> authResult.expiresIn * 1000) + Date.now()
    const expiresAt = JSON.stringify(expireTime)
    localStorage.setItem(ACCESS_TOKEN_KEY, <string> authResult.accessToken)
    localStorage.setItem(ID_TOKEN_KEY, <string> authResult.idToken)
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt)
    // navigate to the home route
    history.replace(HOME_ROUTE)
  }

  private updateAuthState() {
    this.scheduleRenewal()

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || ''
    
    this.accessTokenState.next(accessToken)
    this.authState.next(AUTHENTICATED)
    this.updateCurrentUser(accessToken)
  }

  private scheduleRenewal() {
    const expireTime = JSON.parse(localStorage.getItem(EXPIRES_AT_KEY) || '0')
    const delay = expireTime - Date.now()

    if (delay <= 0) return this.logout()

    this.tokenRenewalTimeout = window.setTimeout(
      () => {
        this.renewToken()
      },
      delay
    )
  }

  private updateCurrentUser(accessToken: string) {
    this.auth.client.userInfo(accessToken, (err, user) => {
      if (err) this.logout()
      this.currentUserDataState.next({
        ...user,
        isAdmin: user[`${AUDIENCE}roles`].includes('admin')
      })
    })
  }
}
