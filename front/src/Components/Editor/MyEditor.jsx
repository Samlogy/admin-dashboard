import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import axios from "axios";

import './style.css'

import "react-quill/dist/quill.snow.css";

// const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

// Quill.register('modules/clipboard', PlainClipboard, true);

const QuillClipboard = Quill.import("modules/clipboard");

const proxy = "http://localhost:5000/";

class Clipboard extends QuillClipboard {
  getMetaTagElements = (stringContent) => {
    const el = document.createElement("div");
    el.innerHTML = stringContent;
    return el.getElementsByTagName("meta");
  };

  async onPaste(e) {
    let clipboardData = e.clipboardData || window.clipboardData;
    let pastedData = await clipboardData.getData("Text");

    const urlMatches = pastedData.match(/\b(http|https)?:\/\/\S+/gi) || [];
    if (urlMatches.length > 0) {
      e.preventDefault();

      urlMatches.forEach((link) => {
        axios
          .get(link)
          .then((payload) => {
            // let title, image, url, description;
            let title, image, url;
            for (let node of this.getMetaTagElements(payload)) {
              if (node.getAttribute("property") === "og:title") {
                title = node.getAttribute("content");
              }
              if (node.getAttribute("property") === "og:image") {
                image = node.getAttribute("content");
              }
              if (node.getAttribute("property") === "og:url") {
                url = node.getAttribute("content");
              }
              // if (node.getAttribute("property") === "og:description") {
              //     description = node.getAttribute("content");
              // }
            }

            const rendered = `<a href=${url} target="_blank"><div><img src=${image} alt=${title} width="20%"/><span>${title}</span></div></a>`;

            let range = this.quill.getSelection();
            let position = range ? range.index : 0;
            this.quill.pasteHTML(position, rendered, "silent");
            this.quill.setSelection(position + rendered.length);
          })
          .catch((error) => console.error(error));
      });
    } else {
      super.onPaste(e);
    }
  }
}
Quill.register("modules/clipboard", Clipboard, true);

const BlockEmbed = Quill.import("blots/block/embed");

class ImageBlot extends BlockEmbed {
  static create(value) {
    const imgTag = super.create();
    imgTag.setAttribute("src", value.src);
    imgTag.setAttribute("alt", value.alt);
    imgTag.setAttribute("width", "100%");
    return imgTag;
  }

  static value(node) {
    return { src: node.getAttribute("src"), alt: node.getAttribute("alt") };
  }
}

ImageBlot.blotName = "image";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

class VideoBlot extends BlockEmbed {
  static create(value) {
    if (value && value.src) {
      const videoTag = super.create();
      videoTag.setAttribute("src", value.src);
      videoTag.setAttribute("title", value.title);
      videoTag.setAttribute("width", "100%");
      videoTag.setAttribute("controls", "");

      return videoTag;
    } else {
      const iframeTag = document.createElement("iframe");
      iframeTag.setAttribute("src", value);
      iframeTag.setAttribute("frameborder", "0");
      iframeTag.setAttribute("allowfullscreen", true);
      iframeTag.setAttribute("width", "100%");
      return iframeTag;
    }
  }

  static value(node) {
    if (node.getAttribute("title")) {
      return { src: node.getAttribute("src"), alt: node.getAttribute("title") };
    } else {
      return node.getAttribute("src");
    }
    // return { src: node.getAttribute('src'), alt: node.getAttribute('title') };
  }
}

VideoBlot.blotName = "video";
VideoBlot.tagName = "video";
Quill.register(VideoBlot);

class FileBlot extends BlockEmbed {
  static create(value) {
    const prefixTag = document.createElement("span");
    prefixTag.innerText = "Attachment- ";

    const bTag = document.createElement("b");
    bTag.innerText = value;

    const linkTag = document.createElement("a");
    linkTag.setAttribute("href", value);
    linkTag.setAttribute("target", "_blank");
    linkTag.setAttribute("className", "file-link-inner-post");
    linkTag.appendChild(bTag);

    const node = super.create();
    node.appendChild(prefixTag);
    node.appendChild(linkTag);

    return node;
  }

  static value(node) {
    const linkTag = node.querySelector("a");
    return linkTag.getAttribute("href");
  }
}

FileBlot.blotName = "file";
FileBlot.tagName = "p";
FileBlot.className = "file-inner-post";
Quill.register(FileBlot);

class PollBlot extends BlockEmbed {
  static create(value) {
    const prefixTag = document.createElement("span");
    prefixTag.innerText = "투표 - ";

    const bTag = document.createElement("b");
    bTag.innerText = value.title;

    const node = super.create();
    node.setAttribute("id", value.id);
    node.appendChild(prefixTag);
    node.appendChild(bTag);

    return node;
  }

  static value(node) {
    const id = node.getAttribute("id");
    const bTag = node.querySelector("b");
    const title = bTag.innerText;
    return { id, title };
  }
}

PollBlot.blotName = "poll";
PollBlot.tagName = "p";
PollBlot.className = "poll-inner-post";
Quill.register(PollBlot);

class MyEditor extends Component {
  bandId;
  placeholder;
  onEditorChange;
  onFilesChange;
  onPollsChange;
  _isMounted;

  constructor(props) {
    super(props);

    this.state = {
      // editorHtml: __ISMSIE__ ? "<p>&nbsp;</p>" : "",
      editorHtml: this.props.value ? this.props.value : "",
      files: []
    };

    this.reactQuillRef = null;

    this.inputOpenImageRef = React.createRef();
    this.inputOpenVideoRef = React.createRef();
    this.inputOpenFileRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (html) => {
    console.log("html", html);

    this.setState({ editorHtml: html }, () => {
      this.props.onEditorChange(this.state.editorHtml);
    });
  };

  imageHandler = () => {
    this.inputOpenImageRef.current.click();
  };

  videoHandler = () => {
    this.inputOpenVideoRef.current.click();
  };

  fileHandler = () => {
    this.inputOpenFileRef.current.click();
  };

  insertImage = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];

      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" }
      };
      formData.append("file", file);

      axios
        .post(`${proxy}/profile/uploadfiles`, formData, config)
        .then((response) => {
          if (response.data.success) {
            const quill = this.reactQuillRef.getEditor();
            quill.focus();

            let range = quill.getSelection();
            let position = range ? range.index : 0;

            quill.insertEmbed(position, "image", {
              src: `${proxy}/` + response.data.url,
              alt: response.data.fileName
            });
            quill.setSelection(position + 1);

            if (this._isMounted) {
              this.setState(
                {
                  files: [...this.state.files, file]
                },
                () => {
                  this.props.onFilesChange(this.state.files);
                }
              );
            }
          } else {
            return alert("failed to upload file");
          }
        });
    }
  };

  insertVideo = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];

      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" }
      };
      formData.append("file", file);

      axios
        .post(`${proxy}/profile/uploadfiles`, formData, config)
        .then((response) => {
          if (response.data.success) {
            const quill = this.reactQuillRef.getEditor();
            quill.focus();

            let range = quill.getSelection();
            let position = range ? range.index : 0;
            quill.insertEmbed(position, "video", {
              src: `${proxy}/` + response.data.url,
              title: response.data.fileName
            });
            quill.setSelection(position + 1);

            if (this._isMounted) {
              this.setState(
                {
                  files: [...this.state.files, file]
                },
                () => {
                  this.props.onFilesChange(this.state.files);
                }
              );
            }
          } else {
            return alert("failed to upload file");
          }
        });
    }
  };

  insertFile = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];
      console.log(file);

      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" }
      };
      formData.append("file", file);

      axios
        .post(`${proxy}/profile/uploadfiles`, formData, config)
        .then((response) => {
          if (response.data.success) {
            const quill = this.reactQuillRef.getEditor();
            quill.focus();

            let range = quill.getSelection();
            let position = range ? range.index : 0;
            quill.insertEmbed(position, "file", response.data.fileName);
            quill.setSelection(position + 1);

            if (this._isMounted) {
              this.setState(
                {
                  files: [...this.state.files, file]
                },
                () => {
                  this.props.onFilesChange(this.state.files);
                }
              );
            }
          }
        });
    }
  };

  render() {
    return (
      <div>
        <div id="toolbar">
          <select
            className="ql-header"
            defaultValue={""}
            onChange={(e) => e.persist()}
          >
            <option value="1" />
            <option value="2" />
            <option value="" />
          </select>

          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
          <button className="ql-insertImage"> I </button>
          <button className="ql-insertVideo"> V </button>
          <button className="ql-insertFile"> F </button>
          <button className="ql-link" />
          <button className="ql-code-block" />
          <button className="ql-video" />
          <button className="ql-blockquote" />
          <button className="ql-clean" />
        </div>

        <div className="text-editor-container">
          <ReactQuill
            theme={"snow"}
            ref={(el) => {
              this.reactQuillRef = el;
            }}
            onChange={this.handleChange}
            value={this.state.editorHtml}
            modules={this.modules}
            formats={this.formats}
          />
        </div>

        <input // insert Img file
          type="file"
          accept="image/*"
          ref={this.inputOpenImageRef}
          style={{ display: "none" }}
          onChange={this.insertImage}
        />

        <input // insert Video file
          type="file"
          accept="video/*"
          ref={this.inputOpenVideoRef}
          style={{ display: "none" }}
          onChange={this.insertVideo}
        />

        <input // insert file
          type="file"
          accept="*"
          ref={this.inputOpenFileRef}
          style={{ display: "none" }}
          onChange={this.insertFile}
        />
      </div>
    );
  }

  modules = {
    syntax: false,
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertImage: this.imageHandler,
        insertVideo: this.videoHandler,
        insertFile: this.fileHandler,
        insertPoll: this.pollHandler
      }
    }
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "image",
    "video",
    "file",
    "link",
    "code-block",
    "video",
    "blockquote",
    "clean"
  ];
}

export default MyEditor;