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
// const commentContainer = document.querySelector(".comment--container");
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
              <button>+</button>
              <span class="upvote">${comnt.vote.score}</span>
              <button>-</button>
            </div>
            <div class="bio--wrapper">
              <img
                src=${comnt.user.image.png}
                alt=${comnt.user.username}
                aria-hidden="true"
              />
              <h1 class="user--name">${comnt.user.username}</h1>
              <p class="time">${comnt.createdAt}</p>
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

function checkReply(id) {
  const commentReply = document.getElementById(`comment--${id}`);
  const replyUser = commentReply.querySelector(".bio--wrapper .user--name");
  // console.log(replyUser.textContent);
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
                <p class="time">now</p>
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
                <span class="replied--user">@${replyUser}</span>
                <p>${textValue}</p>
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
}

function handleEdit(id) {
  const editContainer = document.getElementById(`replies--${id}`);
  const content = editContainer.querySelector(".reply p").textContent;
  editContainer.classList.add("update");
  const textArea = editContainer.querySelector(".reply .update--textarea");
  const updateBtn = editContainer.querySelector(".update--btn");
  textArea.textContent = content;
  let textValue = "";
  textArea.addEventListener("change", () => {
    textValue = textArea.value;
  });
  updateBtn.addEventListener("click", () => {
    handleUpdate(textValue, id);
  });
}
function handleUpdate(value, id) {
  const editContainer = document.getElementById(`replies--${id}`);
  editContainer.classList.remove("update");
  const content = editContainer.querySelector(".reply .comment--reply p");
  content.textContent = value;
}

function handleDelete(id) {
  const replyContainer = document.getElementById(`replies--${id}`);
  replyContainer.remove();
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
  reply.forEach((rep) => {
    replyWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="reply--container ${rep.id ? "" : "hide"}" id="replies--${
        rep.id
      }">
        <div class="upvote--wrapper">
        <button>+</button>
        <span class="upvote">${rep.vote.score}</span>
        <button>-</button>
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
                <p class="time">${rep.createdAt}</p>
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
                <span class="replied--user">@maxblugo</span>
                
                `
                    : ``
                }
                <p>${rep.content}</p>
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

fetchComments();
