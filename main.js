const baseURL = "https://github.com/dazzlerabhi30800/frontendMentor-interactive-comments-section-retake/blob/master/data.json";

let currentUser = {};
let comments = [];

function fetchComments() {
  fetch(baseURL)
    .then(res => res.json())
    .then(data => {
      currentUser= data.currentUser;
      comments = data.comments;
      setComments(comments);
      setCurrentUser(currentUser);
      renderComments();
    })
}