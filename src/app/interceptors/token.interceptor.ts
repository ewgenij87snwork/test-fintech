import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const tokenReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + ACCESS_TOKEN),
  });

  return next(tokenReq);
};
