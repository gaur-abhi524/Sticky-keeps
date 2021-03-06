import React, { useState, useContext, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import Note from "./note";
import Createarea from "./createarea";
import axios from "axios";
import "./styles.scss";
import { AuthContext } from "../../Context/Authcontext";

function Home() {

  const SERVER_URL = "https://sticky-keeps.herokuapp.com/api";

  // const SERVER_URL = "http://localhost:8080/api";

  const [notes, changenotes] = useState([]);
  const [showAll, setshowAll] = useState("");
  const { user } = useContext(AuthContext);

  const additem = async (newtitle, newtext) => {
    const newNote = {
      userId: user._id,
      title: newtitle,
      content: newtext,
    };
    try {
      await axios.post(SERVER_URL + "/notes", newNote);
      setshowAll("added");
    } catch (err) {}
  };

  const deleteitem = async (id) => {
    try {
      await axios.delete(SERVER_URL + "/notes/" + id);
      setshowAll("deleted");
    } catch (err) {}
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(SERVER_URL + "/notes/" + user._id);
      changenotes(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [user._id, showAll]);

  const Logout = async () => {
    try {
      sessionStorage.removeItem("user");
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      const temp = await axios.get(SERVER_URL + "/auth/logout");
      console.log(temp);
      window.location.reload();
    } catch (err) {}
  };

  const Search = async (title) => {
    try {
      if (title === "") {
        setshowAll("All");
        return;
      }
      const fetchPosts = async () => {
        const res = await axios.get(SERVER_URL + "/notes/find/" + title);
        changenotes(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      };
      fetchPosts();
    } catch (err) {}
  };

  return (
    <div className="home">
      <Header logout={Logout} search={Search} />
      <Createarea submit={additem} />
      {notes.map((n) => (
        <Note
          key={n._id}
          id={n._id}
          title={n.title}
          content={n.content}
          deletenote={deleteitem}
        />
      ))}
      <Footer />
    </div>
  );
}

export default Home;
