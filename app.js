import {
  getTrendingCourses,
  getCategories,
  getRawData,
} from "./data/dataHandler.js";

async function routers() {
  const hash = window.location.hash;
  console.log(hash);
  const aapContainer = document.getElementById("app");
  console.log(aapContainer);
  aapContainer.innerHTML = "";

  switch (hash) {
    case "#home":
      aapContainer.innerHTML = await renderHomePage();
      break;

    case "#courses":
      aapContainer.innerHTML = await renderCoursesPage();
      break;
    case "#dashboard":
      aapContainer.innerHTML = "<h1>Helo welcom to the dashboard page!</h1>";
      break;
    default:
      if (hash.startsWith("#course=")) {
        const coureID = hash.split("=")[1];
        aapContainer.innerHTML = `<h1>Course Detail Page</h1><p>Course ID: ${coureID}</p>`;
      }
  }
}
// routers()

window.addEventListener("hashchange", routers);
window.addEventListener("load", routers);
if (!window.location.hash) {
  window.location.hash = "#home";
}
async function renderHomePage() {
  const heroSec = `<div class="p-5 mb-4 bg-light rounded-3 text-center">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Learn Anything, Anytime.</h1>
        <p class="col-md-8 fs-4 mx-auto">
          Explore thousands of courses taught by expert instructors. 
          Start your learning journey today!
        </p>
        <a href="#courses" class="btn btn-primary btn-lg" type="button">
          Browse All Courses
        </a>
      </div>
    </div>
  `;
  let categoreisSec = "";
  let trendingSECHTML = "";
  try {
    const [trendingCourses, courseCategories] = await Promise.all([
      getTrendingCourses(),
      getCategories(),
    ]);
    console.log("trendingCourses", trendingCourses);
    console.log("courseCategories", courseCategories);
    trendingSECHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center mb-5 text-center p-3 p-sm-4">
    <h1 class="display-5 fw-bold">Welcome To The Trending Courses!</h1>
</div> `;
    trendingSECHTML += '<div class="d-flex flex-wrap justify-content-center">';
    trendingCourses.forEach((data) => {
      trendingSECHTML += `<div class="card text-center mx-2 my-2 bg-light" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <p class="card-text">${data.short_description}</p>
<a href="#course=${data.id}">View Course</a>  </div>
</div>`;
    });
    trendingSECHTML += "</div>";
    categoreisSec += ` 
      <div class="text-center mx-auto mt-5 pt-4 border-top">
        <h2 class="mb-4"> Browse Categories</h2>
      </div>`;
    categoreisSec += `<div class="d-flex flex-wrap justify-content-center mb-5">`;
    for (let category in courseCategories) {
      const count = courseCategories[category].length;
      categoreisSec += `
             <a href="#category=${category}" class="btn btn-outline-dark m-2">
                ${category} (${count})
            </a>`;
    }
    categoreisSec += `</div>`;
    return heroSec + trendingSECHTML + categoreisSec;
  } catch (error) {
    console.error("data fetching failed", error);
  }
}
async function renderCoursesPage() {
  let courseCards = "";
  try {
    const courses = await getRawData();
    //     courseCards += '<div class="d-flex flex-wrap justify-content-center">';
    //     courses.forEach((data) => {
    //       console.log(data.title)
    //       courseCards += `
    //       <div class="card mx-3 mt-2" style="width: 18rem;">
    //   <img src=${data.image_url} class="card-img-top" alt="...">
    //   <div class="card-body">
    //     <h5 class="card-title">${data.title}</h5>
    //     <p class="card-text">${data.description}.</p>
    //    <a href="#course=${data.id}" class="btn btn-primary">View Course</a>
    //   </div>
    // </div>
    //       `;
    //     });
    //     courseCards += `</div>`;

    courseCards += '<div class="d-flex flex-wrap justify-content-center">';
    courses.forEach((data) => {
      courseCards += `
      <div class="card course-card mx-3 mt-4 mb-4" style="width: 18rem;">
        
        <img src="${
          data.image_url
        }" class="card-img-top course-image" alt="Course Image">
        
        <div class="card-body">
          <h5 class="card-title fw-bold">${data.title}</h5>
          
          <div class="card-info mb-3">
            <span class="badge bg-secondary me-2">${data.category}</span>
            <span class="badge ${
              data.level === "Beginner"
                ? "bg-success"
                : data.level === "Intermediate"
                ? "bg-warning text-dark"
                : "bg-danger"
            }">${data.level}</span>
          </div>
          
          <a href="#course=${
            data.id
          }" class="btn btn-primary w-100">Start Course</a>
        </div>
      </div>
      `;
    });
    courseCards += `</div>`;

    console.log("courses==>", courses);
    return courseCards;
  } catch (error) {}
}
// renderCoursesPage();
