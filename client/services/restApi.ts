import { Observable } from 'rxjs/Observable'
import { AjaxResponse, AjaxRequest } from 'rxjs/observable/dom/AjaxObservable'
import 'rxjs/add/observable/dom/ajax'

import { Injectable } from 'react.di'

/**
 * API abstraction layer
 */

const BASE_URL = '/api'

@Injectable
export class RestClient {
  get({ url, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .get(<string> BASE_URL + url, headers)
  }
  
  /**
   * Special post method is used to be able to track upload progress
   */
  post({ url, body, headers, progressSubscriber }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax({
      url: BASE_URL + url,
      body,
      headers,
      method: 'post',
      crossDomain: true,
      progressSubscriber
    })
  }
  
  put({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .put(<string> BASE_URL + url, body, headers)
  }
  
  delete({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .delete(<string> BASE_URL + url, headers)
  }
}
