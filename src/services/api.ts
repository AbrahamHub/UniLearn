const BASE_URL = '/mocks';

export const fetchUsers = async () => {
  const response = await fetch(`${BASE_URL}/users.json`);
  const data = await response.json();
  return data.users;
};

export const fetchCourses = async () => {
  const response = await fetch(`${BASE_URL}/courses.json`);
  const data = await response.json();
  return data.courses;
};

export const fetchCourseById = async (id: string) => {
  const courses = await fetchCourses();
  return courses.find((course: any) => course.id === id);
};

export const fetchCareers = async () => {
  const response = await fetch(`${BASE_URL}/careers.json`);
  const data = await response.json();
  return data.careers;
};

export const fetchLearningUnits = async () => {
  const response = await fetch(`${BASE_URL}/learning-units.json`);
  const data = await response.json();
  return data.learningUnits;
};

export const fetchLearningUnitsByCareer = async (careerId: string) => {
  const learningUnits = await fetchLearningUnits();
  return learningUnits.filter((unit: any) => unit.careerIds.includes(careerId));
};

export const fetchCareersByLearningUnit = async (unitId: string) => {
  const careers = await fetchCareers();
  return careers.filter((career: any) => career.learningUnitIds.includes(unitId));
};