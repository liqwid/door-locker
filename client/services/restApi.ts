import { Observable } from 'rxjs/Observable'
import { AjaxResponse, AjaxRequest } from 'rxjs/observable/dom/AjaxObservable'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/catch'

import { Injectable, Inject } from 'react.di'

import { AuthService } from 'services/auth'

/**
 * API abstraction layer
 */

const BASE_URL = '/api'

@Injectable
export class RestClient {
  private baseHeaders: { Authorization?: string } = {}
  
  constructor(
    @Inject protected auth: AuthService
  ) {
    this.connectToAuth()
  }
  
  public get({ url, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .get(<string> BASE_URL + url, { ...headers, ...this.baseHeaders })
      .catch(this.onError)
    }
  
  /**
   * Special post method is used to be able to track upload progress
   */
  public post({ url, body, headers, progressSubscriber }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax({
      url: BASE_URL + url,
      body,
      headers: { ...headers, ...this.baseHeaders },
      method: 'post',
      crossDomain: true,
      progressSubscriber
    })
    .catch(this.onError)
  }
  
  public put({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .put(<string> BASE_URL + url, body, { ...headers, ...this.baseHeaders })
  }
  
  public delete({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .delete(<string> BASE_URL + url, { ...headers, ...this.baseHeaders })
      .catch(this.onError)
  }

  private connectToAuth() {
    this.auth.getAcessTokenStream()
    .subscribe((token) => this.baseHeaders.Authorization = `Bearer ${token}`)
  }

  private onError = (response: AjaxResponse) => {
    if (response.status === 401) {
      this.auth.logout()
    }
    return Observable.throw(response)
  }
}
