import React,{useState} from 'react';

function Header(props){

    const [input,setinput] =useState('');

    const handleOnClick = () =>{ 
        setinput('');
        window.location.reload();
    };

    return(
        <header>
            <h1 onClick={handleOnClick} style={{cursor:"pointer"}}>Sticky keeps</h1>
            <form onSubmit={(e)=> {
                e.preventDefault();
                props.search(input);
            }}>
                <input type="search" placeholder="Search note by title" value={input} onChange={(e) => {setinput(e.target.value)}} className="searchinput"></input>
                <input type="submit" style={{display: "none"}} />
            </form>
            <button className="logout" onClick={props.logout}>Logout</button>
        </header>
    )
};

export default Header;