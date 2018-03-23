import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mergeMapTo'
import 'rxjs/add/operator/switchMap'

import { Injectable, Inject } from 'react.di'

import { RestClient } from 'services/restApi'

type SUCCESS = 'success'
type LOADING = 'loading'
type ERROR = 'error'

export const SUCCESS: SUCCESS = 'success'
export const LOADING: LOADING = 'loading'
export const ERROR: ERROR = 'error'

export type FETCH_STATUS = LOADING | ERROR | SUCCESS

export interface CollectionItem {
  id?: string
}

/**
 * @prop {FETCH_STATUS} status fetch status
 * @prop {T[]} items array of fetched items
 */
export interface FetchMessage<T extends CollectionItem> {
  status: FETCH_STATUS
  items: T[]
}

@Injectable
export abstract class CollectionService<T extends CollectionItem> {
  protected endPoint: string
  private dataState: BehaviorSubject<FetchMessage<T>> = new BehaviorSubject({
    status: LOADING,
    items: []
  })
  private fetchHandle: Subject<null> = new Subject()

  constructor(
    @Inject protected restApi: RestClient
  ) {
    this.initFetchStream()
  }
  
  /**
   * Initiates a fetch
   */
  public fetchItems = () => {
    this.fetchHandle.next()
  }

  /**
   * Adds new item
   * @param {T} item Item to be added
   * @returns response observable
   */
  public addItem = (item: T): Observable<AjaxResponse> => {
    const requestStream = this.restApi.post({ url: this.endPoint, body: item })
    
    // Adds item to the current state
    requestStream.map(({ response }: AjaxResponse) => {
      const { status, items } = this.dataState.getValue()
      return {
        status,
        items: [ ...items, response ]
      }
    })
    .subscribe(this.updateData)

    return requestStream
  }

  /**
   * Updates item
   * @param {string} itemId id of updated item
   * @param {T} itemData item with some updated fields
   * @returns response observable
   */
  public updateItem = (itemId: string, itemData: T): Observable<AjaxResponse> => {
    const requestStream = this.restApi.put({ url: `${this.endPoint}/${itemId}`, body: itemData })
    
    // Adds item to the current state
    requestStream.map(({ response }: AjaxResponse) => {
      const { status, items } = this.dataState.getValue()
      return {
        status,
        items: items.map((item: T) => {
          if (itemId === item.id) return response
          return item
        })
      }
    })
    .subscribe(this.updateData)

    return requestStream
  }

  /**
   * Deletes item
   * @param {string} itemId  id of updated item
   * @returns response observable
   */
  public deleteItem = (itemId: string): Observable<AjaxResponse> => {
    const requestStream = this.restApi.delete({ url: `${this.endPoint}/${itemId}` })
    
    // Adds item to the current state
    requestStream.map(() => {
      const { status, items } = this.dataState.getValue()
      return {
        status,
        items: [ ...items.filter(({ id }: T) => id !== itemId ) ]
      }
    })
    .subscribe(this.updateData)

    return requestStream
  }

  /**
   * Returns stream in format { status, items }
   * @returns {Observable<FetchMessage<T>>}
   */
  public getDataStream = (): Observable<FetchMessage<T>> => {
    return this.dataState.asObservable()
  }

  public getItemsStream = (): Observable<T[]> => {
    return this.dataState.asObservable()
    .map((data: FetchMessage<T>): T[] => data.items)
  }

  public getStatusStream = (): Observable<FETCH_STATUS> => {
    return this.dataState.asObservable()
    .map((data: FetchMessage<T>): FETCH_STATUS => data.status)
  }

  /**
   * Initializes fetch stream
   * Fetch stream is controlled by fetch handle:
   * this.fetchHandle.next() launches fetch
   */
  private initFetchStream() {
    // Performs a fetch upon fetchHandle activation
    this.fetchHandle
    // switchMap drops previous rest requests
    .switchMap(() => this.restApi.get({ url: this.endPoint }))
    .do(console.log)
    .map(({ response }: AjaxResponse) => ({
      status: SUCCESS,
      items: response
    }))
    .catch(() => Observable.of({
      status: ERROR,
      ...this.dataState.getValue()
    }))
    .subscribe(this.updateData)
  }

  private updateData = (data: FetchMessage<T>) => this.dataState.next(data)
}
