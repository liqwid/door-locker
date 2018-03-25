import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { Injectable } from 'react.di'

import * as auth0 from 'auth0-js'

import { history } from 'services/history'

export type AUTH_STATUS = LOADING | AUTHENTICATED | UNAUTHENTICATED

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const EXPIRES_AT_KEY = 'expires_at'

const CLIENT_DOMAIN = 'app91370810.eu.auth0.com'
const CLIENT_ID = 'cFSebJZLEfamNMgN7oIP80JyaBBcSxz9'
const REDIRECT = `${process.env.REACT_APP_URL}callback`
const AUDIENCE = 'https://app91370810.eu.auth0.com/userinfo'
const RESPONSE_TYPE = 'token id_token'
const SCOPE = 'openid'

const HOME_ROUTE = '/'

type LOADING = string
type AUTHENTICATED = string
type UNAUTHENTICATED = string

export const LOADING: LOADING = 'loading'
export const AUTHENTICATED: AUTHENTICATED = 'authenticated'
export const UNAUTHENTICATED: UNAUTHENTICATED = 'unauthenticated'

@Injectable
export class AuthService {
  private authState: BehaviorSubject<AUTH_STATUS> = new BehaviorSubject(LOADING)
  private accessTokenState: BehaviorSubject<string | null> = new BehaviorSubject(null)
  private tokenRenewalTimeout: number
  
  private auth0 = new auth0.WebAuth({
    domain: CLIENT_DOMAIN,
    clientID: CLIENT_ID,
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    responseType: RESPONSE_TYPE,
    scope: SCOPE
  })

  public initialize() {
    if (/access_token|id_token|error/.test(window.location.hash)) {
      this.auth0.parseHash(this.onAuth)
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

  public logout = () => {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ID_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    // navigate to the home route
    history.replace(HOME_ROUTE)
    
    this.authState.next(UNAUTHENTICATED)

    clearTimeout(this.tokenRenewalTimeout)
  }

  public login = () => {
    this.auth0.authorize()
  }

  public renewToken() {
    this.auth0.checkSession({}, this.onAuth)
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

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    
    this.authState.next(AUTHENTICATED)
    this.accessTokenState.next(<string> accessToken)
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
}
