import { Observable } from 'rxjs/Observable'
import { AjaxResponse, AjaxRequest } from 'rxjs/observable/dom/AjaxObservable'
import 'rxjs/add/observable/dom/ajax'

import { Injectable } from 'react.di'

/**
 * API abstraction layer
 */

@Injectable
export class RestClient {
  get({ url, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .get(<string> url, headers)
  }
  
  /**
   * Special post method is used to be able to track upload progress
   */
  post({ url, body, headers, progressSubscriber }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax({
      url,
      body,
      headers,
      method: 'post',
      crossDomain: true,
      progressSubscriber
    })
  }
  
  put({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .put(<string> url, body, headers)
  }
  
  delete({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
    return Observable.ajax
      .delete(<string> url, headers)
  }
}
