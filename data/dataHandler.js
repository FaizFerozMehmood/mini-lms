const DATAFROMJSON = "./data/courses.json";

export async function getRawData() {
  try {
    const response = await fetch(DATAFROMJSON);
    if (!response.ok) {
      throw new Error("erorr while fetching data from courses.json");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("erorr while fetching data from courses.json");
  }
}

export async function getCategories() {
  try {
    const allCourses = await getRawData();
    const categories = {};
    console.log(allCourses);
    allCourses.forEach((course) => {
      if (!categories[course.category]) {
        categories[course.category] = [];
      }
      categories[course.category].push(course);
    });
    // const categories = al
    // lCourses.map((data) => data.category);

    // console.log(categories);
    return categories
  } catch (error) {
    console.log("error fetch categoreis..!");
  }
}
export async function getTrendingCourses() {
  try {
    const allCourses = await getRawData();
    const trending = await allCourses.filter(
      (data) => data.is_trending === true
    );
    return trending;
  } catch (error) {
    console.log("error fetch trendingc.");
    return [];
  }
}

// export async function getAllCouses(){

// }