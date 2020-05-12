module.exports = {

    /* REQUEST HEADER VERIFICATION 

    verifyToken(request, response, next){ //verifies if there is a jwt or not
        const bearerHeader = request.headers.authorization;

        if(bearerHeader){ //verifies if the bearerHeader is not undefined or null

            //The default authorization format is authorization: Bearer token

            //To take the Bearer out and get only the token, the .replace() or .split() js functions can de used
        
            const token = bearerHeader.replace('Bearer ','');

            request.token = token; //if there is a token, this allows the next middleares in the pile to access it, beacause they have the same request and response

            next(); // call the next middleware
        }else{
            response.status(401).json({error:"Token is required"})
        }
    }

    */

    /* COOKIE VERIFICATION => 
        SAFER, because cookies are set httpOnly, in other words, not accessible in the browser
        EASIER, because no frontend code is necessary to send the cookies in the request
    */

    verifyToken(request, response, next){ //verifies if there is a jwt or not
        const token = request.cookies.token;

        if(token){ 
            request.token = token; //if there is a token, this allows the next middleares in the pile to access it, beacause they have the same request and response

            next(); // call the next middleware
        }else{
            response.status(401).json({error:"Token is required"})
        }
    }
}