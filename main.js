let currentUser = {};
let comments = [];

function fetchComments() {
  fetch("./data2.json")
    .then((res) => res.json())
    .then((data) => {
      currentUser = data.currentUser;
      comments = data.comments;
      renderComments(currentUser.username);
    });
}
const commentWrapper = document.querySelector(".comment--wrapper");

function renderComments(username) {
  comments.sort((a, b) => b.vote.score - a.vote.score);
  comments.forEach((comnt) => {
    const commentContainer = document.createElement("div");
    commentContainer.id = "comment--" + comnt.id;
    commentContainer.classList.add("comment--container");
    commentWrapper.appendChild(commentContainer);
    let comment = createComment(comnt, comnt.id, commentContainer);
    renderReplies(comnt.replies, comnt.id, username);
    return comment;
  });
}

function createComment(comnt, parentId, comntContainer) {
  comntContainer.insertAdjacentHTML(
    "beforeend",
    `
      <div class="comment" id='comnt--${parentId}'>
            <div class="upvote--wrapper">
              <button onclick="handleVote2(${parentId}, 1)">+</button>
              <span class="upvote">${comnt.vote.score}</span>
              <button onclick="handleVote2(${parentId}, -1)">-</button>
            </div>
            <div class="bio--wrapper">
              <img
                src=${comnt.user.image.png}
                alt=${comnt.user.username}
                aria-hidden="true"
              />
              <h1 class="user--name">${comnt.user.username}</h1>
              <p class="time">${showDate(comnt.createdAt)}</p>
            </div>
            <button class="reply--btn" id="reply--btn--${parentId}" onclick="checkReply(${parentId})">
              <img src="./images/icon-reply.svg" arid-hidden="true" alt="" />
              reply
            </button>
            <div class="comment--para">
              <p>
              ${comnt.content}
              </p>
            </div>
      </div>
      `
  );
}

function handleVote2(id, dir) {
  const commentWrapper = document.getElementById(`comnt--${id}`);
  let upvote = commentWrapper.querySelector(".upvote--wrapper .upvote");
  let newUpvote = parseInt(upvote.textContent);
  if (dir === 1) {
    let newVote = newUpvote;
    upvote.textContent = newVote + 1;
  } else {
    newUpvote--;
    if (newUpvote <= 0) {
      newUpvote = 0;
    }
    upvote.textContent = newUpvote;
  }
}

function checkReply(id) {
  const commentReply = document.getElementById(`comment--${id}`);
  const replyUser = commentReply.querySelector(".bio--wrapper .user--name");
  const repliedUser = replyUser.textContent;
  const replyButton = document.getElementById(`reply--btn--${id}`);
  replyButton.disabled = true;
  createReply(commentReply, id);
}
function createReply(commentContainer, id) {
  if (commentContainer) {
    commentContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="reply--input--container" id="reply--input--${id}">
            <textarea
              name="reply"
              rows="5"
              placeholder="Add a comment"
              id="textValue--${id}"
            ></textarea>
            <img
              src="./images/avatars/image-juliusomo.png"
              aria-hidden="true"
              alt=""
            />
            <button onclick="handleNewComments(${id})">reply</button>
          </div> 
          `
    );
  }
}

function handleNewComments(id) {
  let textValue = document.getElementById(`textValue--${id}`).value;
  const commentReply = document.getElementById(`comment--${id}`);
  const replyUser = commentReply.querySelector(
    ".bio--wrapper .user--name"
  ).textContent;
  const replyWrapper = document.getElementById(`reply--${id}`);
  const replyInput = document.getElementById(`reply--input--${id}`);
  const replyButton = document.getElementById(`reply--btn--${id}`);
  if (textValue !== "") {
    replyWrapper.classList.remove("hide");
    replyWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="reply--container" id="replies--${id}">
        <div class="upvote--wrapper">
        <button>+</button>
        <span class="upvote">0</span>
        <button>-</button>
        </div>
        <div class="bio--wrapper">
        <img
        src='./images/avatars/image-juliusomo.png'
        alt='juliusomo'
        aria-hidden="true"
        />
                <h1 class="user--name">juliusomo</h1>
                <span class="you">you</span> 
                <p class="time">${showDate(moment().format())}</p>
                </div>
                <div class="button--wrapper">
                <button class="btn btn--delete" onclick="handleDelete(${id})">
                <img
                src="./images/icon-delete.svg"
                alt="delete"
                aria-hidden="true"
                />
                Delete
                </button>
                <button class="btn btn--edit" onclick="handleEdit(${id})">
                <img
                src="./images/icon-edit.svg"
                aria-hidden="true"
                alt="edit"
                />
                Edit
                </button>
                </div>
                <div class="comment--para reply" >
                <div class="comment--reply">
                <p><span class="replied--user">@${replyUser}</span> ${textValue}</p>
                </div>
                <textarea class="update--textarea" id="update--${id}"></textarea>
                <button class="update--btn">UPDATE</button>
                </div>
                </div> 
                `
    );
  } else {
    alert("reply input cannot be empty");
  }
  replyInput.remove();
  replyButton.disabled = false;
  textValue = "";
  console.log(replyWrapper.children.length);
}

function checkChildren(id) {
  const replyWrapper = document.getElementById(`reply--${id}`);
  if (replyWrapper.children.length === 0) {
    replyWrapper.classList.add("hide");
  } else {
    replyWrapper.classList.remove("hide");
  }
}

function handleEdit(id) {
  const editContainer = document.getElementById(`replies--${id}`);
  const content = editContainer.querySelector(
    ".reply .comment--reply p"
  ).innerText;
  const userName = editContainer.querySelector(
    ".reply .replied--user"
  ).textContent;
  const slicedContent = content.slice(userName.length + 1);
  editContainer.classList.add("update");
  const textArea = editContainer.querySelector(".reply .update--textarea");
  const updateBtn = editContainer.querySelector(".update--btn");
  textArea.textContent = slicedContent;
  let textValue = "";
  textArea.addEventListener("change", () => {
    textValue = textArea.value;
  });
  updateBtn.addEventListener("click", () => {
    handleUpdate(textValue, id, userName);
  });
}
function handleUpdate(value, id, repliedUser) {
  const editContainer = document.getElementById(`replies--${id}`);
  editContainer.classList.remove("update");
  const content = editContainer.querySelector(".reply .comment--reply p");
  content.innerHTML = `
  <span class="replied--user">${repliedUser}</span>
  ${value}
  `;
}

function handleDelete(id) {
  const replyContainer = document.getElementById(`replies--${id}`);
  const main = document.querySelector("main");
  const Modal = main.querySelector(".modal--wrapper");
  main.classList.add("showModal");
  const cancelBtn = Modal.querySelector("#cancel");
  const deleteBtn = Modal.querySelector("#delete");
  cancelBtn.addEventListener("click", () => main.classList.remove("showModal"));
  deleteBtn.addEventListener("click", () => {
    main.classList.remove("showModal");
    replyContainer.remove();
    checkChildren(id);
  });
}

function setCurrentUser(currentUser, user) {
  if ((currentUser, user)) {
    return `
    <span class="you">you</span>
    `;
  } else {
    return;
  }
}

function renderReplies(reply, replyId, username) {
  let replyWrapper = document.createElement("div");
  const commentContainer = document.getElementById(`comment--${replyId}`);
  replyWrapper.classList.add("reply--wrapper");
  replyWrapper.id = "reply--" + replyId;
  commentContainer.appendChild(replyWrapper);
  console.log(reply.length);
  if (reply.length === 0) {
    replyWrapper.classList.add("hide");
  }
  reply.forEach((rep) => {
    replyWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="reply--container ${
          rep.length !== 0 ? "" : "hide"
        }" id="replies--${rep.id}">
        <div class="upvote--wrapper">
        ${
          rep.user.username !== username
            ? `
          <button onclick="handleVote(${rep.id}, 1)">+</button>
          `
            : `
          <button>+</button>
          `
        }
        <span class="upvote">${rep.vote.score}</span>
        ${
          rep.user.username !== username
            ? `
          <button onclick="handleVote(${rep.id}, -1)">-</button>
          `
            : `
          <button>-</button>
          `
        }
        </div>
        <div class="bio--wrapper">
        <img
        src=${rep.user.image.png}
        alt=${rep.user.username}
        aria-hidden="true"
        />
                <h1 class="user--name">${rep.user.username}</h1>
                <span class=${
                  rep.user.username === username ? "you" : "hide"
                }>you</span> 
                <p class="time">${showDate(rep.createdAt)}</p>
                </div>
                ${
                  rep.user.username === username
                    ? `<div class="button--wrapper">
                <button class="btn btn--delete" onclick="handleDelete(${rep.id})">
                <img
                src="./images/icon-delete.svg"
                alt="delete"
                aria-hidden="true"
                />
                Delete
                </button>
                <button class="btn btn--edit" onclick="handleEdit(${rep.id})">
                <img
                src="./images/icon-edit.svg"
                aria-hidden="true"
                alt="edit"
                />
                Edit
                </button>
                </div>`
                    : `
    <div class="reply--btn">
              <img src="./images/icon-reply.svg" arid-hidden="true" alt="" />
              <button>reply</button>
            </div> 
                `
                }
                
                <div class="comment--para reply" >
                <div class="comment--reply">
                ${
                  rep.user.username === username
                    ? `
                  <p><span class="replied--user">@maxblugo</span> ${rep.content} </p>
                  `
                    : `
                  <p>${rep.content}</p>
                  `
                }
                </div>
                ${
                  rep.user.username === username
                    ? `
                <textarea class="update--textarea" id="update--${rep.id}"></textarea>
                `
                    : ``
                }
              ${
                rep.user.username === username
                  ? `
                <button class="update--btn">UPDATE</button>
                `
                  : ``
              }
                </div>
                </div> 
                `
    );
  });
}

function handleVote(id, dir) {
  const replyContainer = document.getElementById(`replies--${id}`);
  let upvote = replyContainer.querySelector(".upvote--wrapper .upvote");
  let newUpvote = parseInt(upvote.textContent);
  if (dir === 1) {
    let newVote = newUpvote;
    upvote.textContent = newVote + 1;
  } else {
    newUpvote--;
    if (newUpvote <= 0) {
      newUpvote = 0;
    }
    upvote.textContent = newUpvote;
  }
}

function showDate(date) {
  let _date = moment(date);
  let now = moment();
  if (_date.isValid()) {
    let days = now.diff(_date, "days");
    let months = now.diff(_date, "months");
    if (days >= 7 && months == 0) {
      let weeks = now.diff(_date, "weeks"),
        number = weeks > 1 ? "weeks" : "week";
      return `${weeks} ${number} ago`;
    }
    return _date.fromNow();
  }
  return date;
}

fetchComments();
// console.log(showDate("2021-12-24"));

// Post comments
const sendBtn = document.querySelector(".btn--send");
const postInput = document.getElementById("post");
let postValue = "";

postInput.addEventListener("change", () => {
  postValue = postInput.value;
});

sendBtn.addEventListener("click", sendComment);
function sendComment() {
  if (!postValue) return;
  let comntObj = comntObject(postValue, "juliusomo");
  createNewComment(postValue, comntObj.id, comntObj.user);
}

function genID() {
  let lastId = window.localStorage.getItem("last-id");
  if (!lastId) lastId = 13;
  window.localStorage.setItem("last-id", ++lastId);
  return lastId;
}

function comntObject(comntText, user) {
  return {
    id: genID(),
    content: comntText,
    createdAt: moment().format(),
    vote: {
      score: 0,
      detail: [],
    },
    user: user,
    replies: [],
  };
}

function createNewComment(postValue, id, user) {
  const commentWrapper = document.querySelector(".comment--wrapper");
  if (postValue !== "") {
    commentWrapper.insertAdjacentHTML(
      "beforeend",
      `
  <div class="reply--container" id="replies--${id}">
  <div class="upvote--wrapper">
  <button>+</button>
  <span class="upvote">0</span>
  <button>-</button>
  </div>
  <div class="bio--wrapper">
  <img
  src="./images/avatars/image-juliusomo.png"
  alt="juliusomo"
  aria-hidden="true"
        />
        <h1 class="user--name">${user}</h1>
        <span class="you">you</span> 
        <p class="time">${showDate(moment().format())}</p>
        </div>
        <div class="button--wrapper">
        <button class="btn btn--delete" onclick="handleDelete(${id})">
        <img
        src="./images/icon-delete.svg"
        alt="delete"
        aria-hidden="true"
        />
        Delete
        </button>
        <button class="btn btn--edit" onclick="handleEdit2(${id})">
        <img
        src="./images/icon-edit.svg"
        aria-hidden="true"
        alt="edit"
        />
        Edit
        </button>
        </div>
        <div class="comment--para reply" >
        <div class="comment--reply">
        <p>${postValue}</p>
        </div>
        <textarea class="update--textarea"></textarea>
        
        <button class="update--btn">UPDATE</button>
        </div>
        </div>   
        `
    );
    postInput.value = "";
    postValue = "";
  } else {
    alert("post input cannot be blank");
  }
}

function handleEdit2(id) {
  const editContainer = document.getElementById(`replies--${id}`);
  const content = editContainer.querySelector(
    ".reply .comment--reply p"
  ).innerText;
  editContainer.classList.add("update");
  const textArea = editContainer.querySelector(".reply .update--textarea");
  const updateBtn = editContainer.querySelector(".update--btn");
  textArea.textContent = content;
  let textValue = "";
  textArea.addEventListener("change", () => {
    textValue = textArea.value;
  });
  updateBtn.addEventListener("click", () => {
    handleUpdate2(textValue, id);
  });
}
function handleUpdate2(value, id) {
  const editContainer = document.getElementById(`replies--${id}`);
  editContainer.classList.remove("update");
  const content = editContainer.querySelector(".reply .comment--reply p");
  content.textContent = value;
}

// function showId(id) {
//   console.log(id);
// }
