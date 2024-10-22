let h1_Details = document.getElementById("h1-Details");
let username_Details = document.getElementById("username-Details");
let created_at_Details = document.getElementById("created-at-Details");
let title_post_Details = document.getElementById("title-post-Details");
let post_body_Details = document.getElementById("post-body-Details");
let comments_count = document.getElementById("comments-count");
let post_Image = document.getElementById("post-Image");
let profile_image = document.getElementById("profile-Image");
let comments = document.getElementById("comments");
let Add_comment = document.getElementById("Add-comment");



function get_url_parms_postID() {
  let urlparms = new URLSearchParams(window.location.search);
  let id = urlparms.get("postID");
  return id;
}







function Create_post_Details_Request() {
  let ID = get_url_parms_postID();

  toggleLoader(true);
  axios.get(`https://tarmeezacademy.com/api/v1/posts/${ID}`)
    .then((response) => {
      let Cards = document.getElementById('Cards');
      toggleLoader(false);
      let info = response.data.data;


      let commentContent = "";
      for (let comment of info.comments) {

        commentContent += `
    <div class="my-3">
    <div>

     <div>
      <img src="${comment.author.profile_image}" style="width:40px; height:40px; border-radius: 50%;"/>
      <span>${comment.author.username}</span>
     </div>
     
     <div>
      <p>${comment.body}</p>
     </div>

     <hr/>

   </div>
    `;
      }

      let PostTitle = "";
      if (info.title !== null) {
        PostTitle = info.title;
      } else {
        PostTitle = "";
      }

      let postDetail = `

            <div class="my-3">
              <h1 id="h1-Details">${info.author.username} Post</h1>
            </div>

            <div class="card shadow-lg" >
              <div class="card-header" onclick="get_user_info('${encodeURIComponent(JSON.stringify(info))}')" style="cursor: pointer;">
                <img id="profile-Image" src="${info.author.profile_image}" class=" shadow-lg rounded-5" style="width: 40px; height: 40px; border: grey 1px solid;"/>
                <b id="username-Details">${info.author.username}</b>
              </div>


              <div class="card-body">
                <img id="post-Image" src=${info.image} class="w-100" style="height: 450px;"/>
                <p id="created-at-Details" class="card-title" style="color: rgb(130, 128, 128);">${info.created_at}</p>
                <h6 id="title-post-Details">${PostTitle}</h6>
                <p id="post-body-Details" class="card-text">${info.body}</p>
              </div>
                <hr/>
    
                <div class="">

                  <div class="d-flex gap-2 ms-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
      
                    <p id="comments-count">${info.comments_count}</p>
                  </div>
              

                  <div id="comments" class="mx-4">
                  ${commentContent}
                  </div>

                  <div id="Add-comment" class="d-flex">
                    <input id="inputCmmentcontent" type="text" placeholder="Add Comment" style="width: 100%; height: 35px; text-decoration: none; border: none; padding: 10px; "/>
                    <button id="Add" onclick="add_comment_clicked()" type="button" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i></button>
                  </div>
  
                </div>
            </div>
   `;


      Cards.innerHTML = postDetail;


      // add comment by enter key
      let inputCmmentcontent = document.getElementById("inputCmmentcontent");
      let Add = document.getElementById("Add");

      inputCmmentcontent.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          Add.click();
        }
      });


    })

}











function add_comment_clicked() {
  let user = JSON.parse(localStorage.getItem("User"));

  let token = localStorage.getItem("Token");
  let comment = document.getElementById("inputCmmentcontent").value;
  let id = get_url_parms_postID();
  toggleLoader(true);
  axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
    {
      "body": `${comment}`
    }
    ,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);

      ShowAlert('Comment Added', 'success');
      toggleLoader(false)
    }).catch((err) => {
      ShowAlert(`${err.response.data.message}`, 'danger')
      toggleLoader(false)
    })

}


Create_post_Details_Request();

