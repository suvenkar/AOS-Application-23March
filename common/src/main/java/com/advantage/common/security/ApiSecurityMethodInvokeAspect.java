package com.advantage.common.security;

import com.advantage.common.dto.ErrorResponseDto;
import com.advantage.common.enums.AccountType;
import com.advantage.common.exceptions.authorization.AuthorizationException;
import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

//import org.springframework.ws.transport.context.TransportContext;
//import org.springframework.ws.transport.context.TransportContextHolder;
//import org.springframework.ws.transport.http.HttpServletConnection;

@Aspect
public class ApiSecurityMethodInvokeAspect {

    private static final Logger logger = Logger.getLogger("SecurityRequestsLogger");

    @Around("execution(* *(..)) && @annotation(com.advantage.common.security.AuthorizeAsAdmin)")
    public ResponseEntity authorizeAsAdmin(ProceedingJoinPoint joinPoint) throws Throwable {
        ResponseEntity response;
        HttpServletRequest httpServletRequest = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
//        String authorizationHeader = httpServletRequest.getHeader("Authorization");
        String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            SecurityTools.isAuthorized(authorizationHeader, AccountType.ADMIN);
            logger.debug("Authorization for request " + httpServletRequest.getMethod() + " " + httpServletRequest.getRequestURI() + " success");
            response = (ResponseEntity) joinPoint.proceed();
        } catch (AuthorizationException e) {
            logger.warn("Authorization for request " + httpServletRequest.getMethod() + " " + httpServletRequest.getRequestURI() + " failed", e);
            ErrorResponseDto errorResponseDto = new ErrorResponseDto(false, e.getMessage());
            response = new ResponseEntity(errorResponseDto, e.getHttpStatus());
        }
        return response;
    }

    @Around("execution(* *(..)) && @annotation(com.advantage.common.security.AuthorizeAsUser) && args(userId,..)")
    public ResponseEntity authorizeAsUser(ProceedingJoinPoint joinPoint, Long userId) throws Throwable {
        ResponseEntity response;

        HttpServletRequest httpServletRequest = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
//        String authorizationHeader = httpServletRequest.getHeader("Authorization");
        String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            //SecurityTools.isAuthorized(authorizationHeader, userId, AccountType.USER);
            SecurityTools.isAuthorized(authorizationHeader, userId, AccountType.USER, AccountType.ADMIN);
            logger.debug("Authorization for request " + httpServletRequest.getMethod() + " " + httpServletRequest.getRequestURI() + " success");
            response = (ResponseEntity) joinPoint.proceed();
        } catch (AuthorizationException e) {
            logger.warn("Authorization for request " + httpServletRequest.getMethod() + " " + httpServletRequest.getRequestURI() + " failed", e);
            ErrorResponseDto errorResponseDto = new ErrorResponseDto(false, e.getMessage());
            response = new ResponseEntity(errorResponseDto, e.getHttpStatus());
        }
        return response;

//
//        if (authorizationHeader == null || authorizationHeader.isEmpty() || !authorizationHeader.startsWith(AUTHORIZATION_PREFIX)) {
//            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
//        } else {
//            String token2 = authorizationHeader.substring(AUTHORIZATION_PREFIX.length());
//            try {
//                Token token = new TokenJWT(token2);
//                if (token.getUserId() != userId) {
//
//                    return new ResponseEntity(HttpStatus.FORBIDDEN);
//                }
//                if (!token.getAccountType().equals(AccountType.USER)) {
//                    return new ResponseEntity(HttpStatus.FORBIDDEN);
//                }
//            } catch (Throwable e) {
//                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
//            }
//        }

/*

        Object[] args = joinPoint.getArgs();
        HttpServletRequest request = null;
        Signature signature = joinPoint.getSignature();
        String declaringTypeName = signature.getDeclaringTypeName();
        Class declaringType = signature.getDeclaringType();
        String name = signature.getName();

        String token = "";
        for (Object arg : args) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
            }
            if (arg instanceof String) {
                token = (String) arg;
            }
        }

        Principal userPrincipal = httpServletRequest.getUserPrincipal();
        Map<String, String[]> parameterMap = httpServletRequest.getParameterMap();
        //EXCEPTION Collection<Part> parts = httpServletRequest.getParts();
        String servletPath = httpServletRequest.getServletPath();


        MethodSignature msignature = (MethodSignature) joinPoint.getSignature();
        Method method = msignature.getMethod();
        Parameter[] parameters = method.getParameters();
        //discoverer=new AspectJAdviceParameterNameDiscoverer("@annotation(com.advantage.order.store.log.AuthorizeAsUser)");
        discoverer = new StandardReflectionParameterNameDiscoverer();
        String[] parameterNames = discoverer.getParameterNames(method);

        if (method.getDeclaringClass().isInterface()) {
            try {
                method = joinPoint.getTarget().getClass().getDeclaredMethod(joinPoint.getSignature().getName(),
                        method.getParameterTypes());

                int i = 1;
            } catch (final SecurityException exception) {
                //...
            } catch (final NoSuchMethodException exception) {
                //...
            }
        }

        assert request != null;
        if (!ValidationHelper.isAuthorized(request.getSession(), token)) return unAuthorized();
*/


    }

    private static ResponseEntity unAuthorized() {
        return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }

//    protected String getHttpHeaderValue(final String headerName) {
//        HttpServletRequest httpServletRequest = getHttpServletRequest();
//        return (null != httpServletRequest) ? httpServletRequest.getHeader(headerName) : null;
//    }
//
//    protected HttpServletRequest getHttpServletRequest() {
//        TransportContext ctx = TransportContextHolder.getTransportContext();
//        return (null != ctx) ? ((HttpServletConnection) ctx.getConnection()).getHttpServletRequest() : null;
//    }


}
