let comments_count = document.getElementById("cmments_count")
let posts_count = document.getElementById("posts_count")
let Name = document.getElementById("Name")
let username = document.getElementById("username")
let image = document.getElementById("image")
let title_username = document.getElementById("title-username")
let userID_posts = document.getElementById("userID-posts")




function recive_postID_get_user_info() {
  let urlparms = new URLSearchParams(window.location.search);
  let id = urlparms.get("userID");
  return id;
}





function Get_user_Posts() {

  let user = JSON.parse(localStorage.getItem("User"));
  let ID = recive_postID_get_user_info();

  toggleLoader(true);

  // first request to user profile info
  axios.get(`https://tarmeezacademy.com/api/v1/users/${ID}`)
    .then((response) => {

      let info = response.data.data;
      toggleLoader(false)

      if (info.posts_count === 0) {
        title_username.innerHTML = "There are no posts yet";
      } else {
        title_username.innerHTML = `${info.username} `;
      }


      image.src = info.profile_image;
      comments_count.innerHTML = `${info.comments_count} Comments`;
      username.innerHTML = `#${info.username}`
      Name.innerHTML = info.name
      posts_count.innerHTML = `${info.posts_count} Posts`;

      // second request to get user posts
      axios.get(`https://tarmeezacademy.com/api/v1/users/${ID}/posts`)
        .then((response2) => {
          let info2 = response2.data.data;

          for (let post of info2) {


            if (post.title !== null) {
              PostTitle = post.title;
            } else {
              PostTitle = "";
            }


            let button1 = ``;
            let button2 = ``;

            if (user !== null) {
              if (user.id === post.author.id) {
                button1=`<a  data-bs-toggle="modal"  data-bs-target="#edit-post-modal" id="edit-own-post-btn" onclick="edit_post_clicked('${encodeURIComponent(JSON.stringify(post))}')" style="float:right; font-size:25px; cursor:pointer;"><i class="fa-regular fa-pen-to-square text-secondary"></i></a>`
                button2=`<a data-bs-toggle="modal"  data-bs-target="#delete-post-modal" onclick="confirm_delete_alert(${post.author.id},${post.id})" id="delete-post-btn" style="float:right; font-size:25px; cursor:pointer;"><i class="fa-solid fa-trash text-danger"></i></a>`;
              }
            }


            let varible = `
         <div class="card shadow-lg">
          <div class="card-header d-flex justify-content-between ">
            <div onclick="get_user_info('${encodeURIComponent(JSON.stringify(post))}')">
             <img src="${post.author.profile_image}" class=" shadow-lg rounded-5" style="width: 40px; height: 40px; border: grey 1px solid;"/>
             <b>${post.author.username}</b>
            </div>
        
            <div id="post-buttons" style="display:flex; gap:6px">
           ${button1}
            ${button2}
            </div>
        
          </div>
          <div style="cursor: pointer;" onclick="Post_Details_clicked('${encodeURIComponent(JSON.stringify(post))}')" class="card-body">
            <img src=${post.image} class="w-100" style="height: 450px;"/>
            <p class="card-title" style="color: rgb(130, 128, 128);">${post.created_at}</p>
            <h6 id="title-post">${PostTitle}</h6>
            <p class="card-text">${post.body}</p>
          </div>
            <hr/>
        
            <div class="px-3 pb-3 d-flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
              </svg>
        
              <span>${post.comments_count} Comments</span>
        
              
        
            </div>
        </div>
        `;

            userID_posts.innerHTML += varible;

          }
        })

    });
}




Get_user_Posts()