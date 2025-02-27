import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user || !user.token) {
                    // console.log("[AuthInterceptor] No user or token found. Proceeding without auth.");
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    setParams: { auth: user.token }
                });
                // console.log("[AuthInterceptor] Modified Request:", modifiedReq); // ✅ Debugging Log
                return next.handle(modifiedReq);
            })
        );
    }
}
