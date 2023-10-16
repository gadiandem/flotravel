import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
  HttpClient,
  HttpEvent,
} from "@angular/common/http";
import {
  take,
  exhaustMap,
  retryWhen,
  flatMap,
  concatMap,
  delay,
} from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";

@Injectable()
export class RetryInterceptorService implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let timeDelay = 1;
    return next.handle(req).pipe(
      retryWhen((error) => {
        return error.pipe(
          concatMap((error, count) => {
            if (count <= 5 && error.status == 503) {
              timeDelay++;
              return of(error);
            }
            return throwError(error);
          }),  delay(1000 * (timeDelay))
        );
      })
    );
  }
}
