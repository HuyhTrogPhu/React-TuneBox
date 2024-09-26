document.addEventListener('DOMContentLoaded', function() {
  var createPostBtn = document.getElementById('create-post-btn');
  var postModal = document.getElementById('post-modal');
  var postTextarea = document.getElementById('post-textarea');
  var closeModal = document.getElementById('close-modal');

  // Thêm log để kiểm tra từng phần tử
  console.log("createPostBtn:", createPostBtn);
  console.log("postModal:", postModal);
  console.log("postTextarea:", postTextarea);
  console.log("closeModal:", closeModal);

  if (createPostBtn && postModal && postTextarea && closeModal) {
    createPostBtn.addEventListener('click', function() {
      postModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
      postModal.style.display = 'none';
    });
  } else {
    console.error('One or more elements not found');
  }

  console.log(postModal);
});
