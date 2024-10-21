
let title_post=document.getElementById("Title-Post");
let Body_post=document.getElementById("Body-Post");
let Image_post=document.getElementById("Image-Post");
let Cards = document.getElementById("Cards");
let edit_own_post_btn=document.getElementById("edit-own-post-btn")


let currentPage=1;
let lastPage=1;

// Loader To improve user experience
window.addEventListener("scroll",()=>{

  let endOfPage=window.innerHeight+window.scrollY>=document.body.scrollHeight;

  if(endOfPage && currentPage <= lastPage){
    currentPage++;
    Get_Posts(currentPage);
  }
})




function Get_Posts(page) {
  let user=JSON.parse(localStorage.getItem("User"));

  toggleLoader(true);
  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=25&page=${page}`)
  .then((response) => {
    toggleLoader(false)
  let info = response.data.data;
  let PostTitle = "";
  
  lastPage=response.data.meta.last_page;
 
  for (let post of info) {

    if (post.title !== null) {
      PostTitle = post.title;
    } else {
      PostTitle = "";
    }

    let button1=``;
    let button2=``;
    
    if(user!==null){
      if(user.id===post.author.id){
        button1=` <button data-bs-toggle="modal"  data-bs-target="#edit-post-modal" id="edit-own-post-btn" onclick="edit_post_clicked('${encodeURIComponent(JSON.stringify(post))}')" style="float:right;" type="button" class="btn btn-secondary">Edit</button>`;
        button2=`<button data-bs-toggle="modal"  data-bs-target="#delete-post-modal" onclick="confirm_delete_alert(${post.author.id},${post.id})" id="delete-post-btn" style="float:right;" type="button" class="btn btn-danger mx-1">Delete</button>`;
      }
    }
    

    let varible = `
 <div class="card shadow-lg">
  <div class="card-header d-flex justify-content-between ">

    <div onclick="get_user_info('${encodeURIComponent(JSON.stringify(post))}')" style="cursor:pointer;">
     <img src="${post.author.profile_image}" class=" shadow-lg rounded-5" style="width: 40px; height: 40px; border: grey 1px solid;"/>
     <b>${post.author.username}</b>
    </div>

    <div id="post-buttons">
   ${button1}
    ${button2}
    </div>

  </div>
  <div style="cursor: pointer;" onclick="Post_Details_clicked(${post.id})" class="card-body">
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

      <div class="d-flex gap-1">
        <div class="rounded-3" style="background-color:grey; color:white; padding:0 5px">${post.tags}</div>
        <div class="rounded-3" style="background-color:grey; color:white; padding:0 5px">${post.tags}</div>
      </div>

    </div>
</div>
`;

    Cards.innerHTML += varible;

    }
  });
 }

 Get_Posts();







function add_post_clicked(){
  document.getElementById("add-post-title").innerHTML="Create new Post";
  add_edit_post_btn.innerHTML="Create";
  document.getElementById("input-check").value="";
  let postmodal = new bootstrap.Modal(document.getElementById("add-post-modal"));
  postmodal.toggle();
  }




