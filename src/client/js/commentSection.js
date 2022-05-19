const videoContainer = document.getElementById("player");
const form = document.querySelectorAll(".comment-box");
const textarea = document.querySelectorAll('textarea');
const deleteCommentBtns = document.querySelectorAll(".comment-menu-renderer ion-icon");
const commentCounts = document.querySelectorAll(".comments-section-header h3");
let commentThreadRenderer = document.querySelectorAll(".comment-thread-renderer");
let commentCountsNumber = commentThreadRenderer.length / 2;

const addComment = (text, newCommentId, userAvatar, username, createdAt) => {
    const videoCommentSection = document.querySelectorAll(".comments-section-contents");
    for(let i = 0; i < videoCommentSection.length; i++) {
        const newComment = document.createElement("div");
        newComment.className = "comment-thread-renderer";
        newComment.dataset.id = newCommentId;
        const newCommentRenderer = document.createElement("div");
        newCommentRenderer.className = "comment-renderer";
        const newCommentBody = document.createElement("div");
        newCommentBody.setAttribute("id", "comment-body");

        const newCommentAuthor = document.createElement("div");
        newCommentAuthor.className = "author-thumbnail";
        newCommentAuthor.setAttribute("id", "author-thumbnail");
        const authorAnchor = document.createElement("a");
        authorAnchor.setAttribute("href", "#");
        let authorImgTag = `<img src="${userAvatar}">`
        authorAnchor.innerHTML = authorImgTag;
        newCommentAuthor.appendChild(authorAnchor);

        const newCommentDialog = document.createElement("div");
        newCommentDialog.setAttribute("id", "comment-dialog");
        const dialogHeader = document.createElement("div");
        dialogHeader.setAttribute("id", "comment-main__header");
        const dialogHeaderAuthor = document.createElement("div");
        dialogHeaderAuthor.setAttribute("id", "header-author");
        const authorName = document.createElement("span");
        authorName.setAttribute("id", "author-username")
        authorName.innerHTML = `${username}`;
        const createdTime = document.createElement("span");
        createdTime.setAttribute("id", "commented-time")
        createdTime.innerHTML = `${createdAt}`;
        dialogHeaderAuthor.appendChild(authorName);
        dialogHeaderAuthor.appendChild(createdTime);
        dialogHeader.appendChild(dialogHeaderAuthor);
        const dialogExpander = document.createElement("div");
        dialogExpander.setAttribute("id", "comment-main__expander");
        const expanderContent = document.createElement("p");
        expanderContent.innerText = `${text}`;
        dialogExpander.appendChild(expanderContent);
        newCommentDialog.appendChild(dialogHeader);
        newCommentDialog.appendChild(dialogExpander);

        const newCommentActionMenu = document.createElement("div");
        newCommentActionMenu.setAttribute("id", "comment-action-menu");
        const newCommentDeleteBox = document.createElement("div");
        newCommentDeleteBox.className = "comment-menu-renderer";
        let trashIcon = `<ion-icon name="trash">`
        newCommentDeleteBox.innerHTML = trashIcon;
        newCommentActionMenu.appendChild(newCommentDeleteBox);

        newCommentBody.appendChild(newCommentAuthor);
        newCommentBody.appendChild(newCommentDialog);
        newCommentBody.appendChild(newCommentActionMenu);
        newCommentRenderer.appendChild(newCommentBody);
        newComment.appendChild(newCommentRenderer);
        videoCommentSection[i].prepend(newComment);
    }
    commentThreadRenderer = document.querySelectorAll(".comment-thread-renderer");
    commentCountsNumber = commentThreadRenderer.length / 2;
    commentCounts.forEach(commentCounts => commentCounts.innerHTML = `${commentCountsNumber} comments`);
}
const handleDeleteComment = async (event) => {
    const targetId = event.srcElement.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id;
    const targetComment = document.querySelectorAll(`[data-id="${targetId}"]`);
    const {
        dataset: {
            id: commentId
        },
    } = targetComment[0];
    for(let i = 0; i < targetComment.length; i ++) {
        targetComment[i].remove();
    }
    commentThreadRenderer = document.querySelectorAll(".comment-thread-renderer");
    commentCountsNumber = commentThreadRenderer.length / 2;
    commentCounts.forEach(commentCounts => commentCounts.innerHTML = `${commentCountsNumber} comments`);
    const response = await fetch(`/api/comments/${commentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
};
const handleSubmit = async(event) => {
    event.preventDefault();
    const textarea = event.target.querySelector('textarea');
    textarea.style.height = '1.5rem';
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId, userAvatar, username, createdAt } = await response.json();
        addComment(text, newCommentId, userAvatar, username, createdAt);
    }
}
if (form) {
    form.forEach(form => form.addEventListener("submit", handleSubmit));
}
textarea.forEach(textarea => textarea.addEventListener("input", (event) => {
    let currentTextArea = event.target;
    const handleCancel = (event) => {
        const currentCancelBtn = event.currentTarget.parentElement.querySelector("#cancel-button");
        const handleClear = () => {
            currentTextArea.value = "";
        }
        currentCancelBtn.addEventListener("click", handleClear);
    }
    handleCancel(event)
    const autoResizeTextarea = (event) => {
        textarea.style.height = '1.5rem';
        let height = currentTextArea.scrollHeight; // 높이
        currentTextArea.style.height = `${height}px`;
    }
    autoResizeTextarea(event)
}));
deleteCommentBtns.forEach(deleteCommentBtns => deleteCommentBtns.addEventListener("click", handleDeleteComment));