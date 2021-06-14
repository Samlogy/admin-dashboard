import React, { useState } from "react";

import MyEditor from "../../Components/Editor/MyEditor.jsx";
import "./style.css";

const proxy = "http://localhost:5000/";

const WriteNewsletter = () => {
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [files, setFiles] = useState([]);

  const onEditorChange = (value) => {
    setNewsletter({ ...newsletter, message: value });
    console.log(newsletter.message);
  };
  const onFilesChange = (files) => {
    setFiles(files);
  };

  const writeNewsltter = async (e) => {
    e.preventDefault();
    const url = `${proxy}/admin/writeNewsletter`;

    // newsletter data validation --> schema
    const variables = {
      newsletterData: newsletter,
      files: files,
      authorID: "" // user.id
    };

    try {
      const res = await fetch(url, {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(variables)
      });

      if (res.ok) {
        const result = await res.json();
        console.log(result.message);
        return;
      }
      console.log("an Error occured while editing post !");
      // console.log(variables);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return (
    <div className="write-newsletter-container">
      <h2> Write Newsletter </h2>

      <form
        method="POST"
        className="write-newsletter-form"
        onSubmit={writeNewsltter}
      >
        <div className="form-input">
          <label htmlFor="subject"> Subject </label>
          <input
            type="text"
            id="subject"
            placeholder="Subject"
            name="subject"
            value={newsletter.subject}
            onChange={(e) =>
              setNewsletter({ ...newsletter, subject: e.target.value })
            }
          />
        </div>

        <div className="form-input">
          <label htmlFor="newsletter"> Newsletter Content </label>
          <MyEditor
            placeholder="Newsletter Content"
            onEditorChange={onEditorChange}
            onFilesChange={onFilesChange}
          />
        </div>

        <button className="btn btn-accent" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default WriteNewsletter;
