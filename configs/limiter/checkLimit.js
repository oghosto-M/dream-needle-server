const RATE_LIMIT = 100; 
const WINDOW_SIZE_IN_MINUTES = 2; 
const REQUESTS = {}; 


const checkRateLimit = (ip) => {  
    const now = Date.now();  
    const windowStart = now - WINDOW_SIZE_IN_MINUTES * 60 * 1000;


    if (!REQUESTS[ip]) {  
        REQUESTS[ip] = { count: 1, lastRequestTime: now };  
    } else {  

        REQUESTS[ip].lastRequestTime = now;  

        if (REQUESTS[ip].lastRequestTime < windowStart) {  
            REQUESTS[ip].count = 1;  
        } else {  
            REQUESTS[ip].count += 1;
        }  
    }  

    if (REQUESTS[ip].count > RATE_LIMIT) {  
        return false;  
    }  
    return true;  
};  

module.exports = checkRateLimit