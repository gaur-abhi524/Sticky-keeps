import React,{useState} from "react";

function CreateArea(props) {

  const [note,setnote]=useState({
    title:"",
    content:""
  });

  const handlechange = (e)=>{
    const name=e.target.name;
    const text=e.target.value;
    setnote((prev) => {
      return(
        {
          ...prev,
          [name]:text
        }
        )
    })
  }

  return (
    <div>
      <form className="noteinput">
        <input name="title" onChange={handlechange} placeholder="Title" value={note.title}/>
        <textarea name="content" onChange={handlechange} placeholder="Take a note..." rows="3" value={note.content}/>
        <button onClick={(e) => {
          e.preventDefault();
          props.submit(note.title,note.content)
          setnote({title:"",content:""})
        }}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
