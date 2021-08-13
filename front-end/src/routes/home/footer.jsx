import React from 'react';

let today=new Date();
let year=today.getFullYear();

function Footer(){
    return(
        <footer>
            <p>&copy; copyright Appropriate_AG_524 {year}</p>
        </footer>
    )
}

export default Footer;