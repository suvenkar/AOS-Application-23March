package com.advantage.order.store.config;


import com.google.common.net.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CORSConfig3 extends OncePerRequestFilter {
    static final String ORIGIN = "Origin";
    //

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       /* if (request.getHeader(ORIGIN).equals("null")) {
            String origin = request.getHeader(ORIGIN);
            response.setHeader("Access-Control-Allow-Origin", "*");/*//* or origin as u prefer
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Headers",
                    request.getHeader("Access-Control-Request-Headers"));
        }*/

        response.setHeader("Access-Control-Request-Method", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, soapaction");

        response.setHeader("Expires", "0");
        response.setHeader("Cache-control", "no-store");

        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        if (request.getMethod().equals("OPTIONS")) {
            try {
                //ogger.info("Method OPTIONS, Origin header=" + request.getHeader("Origin"));
//                response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
                response.getWriter().print("OK");
                response.getWriter().flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
