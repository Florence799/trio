const Course = require('../models/Course');
const Material = require('../models/Material');

const createCourse = async (req, res) => {
  try {
    const { courseName, description, department, year, section } = req.body;
    const course = new Course({
      courseName,
      description,
      teacher: req.user.id,
      department,
      year,
      section
    });
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Student') {
      // Students only see courses assigned to their dept/year/section
      query = {
        department: req.user.department,
        year: req.user.year,
        section: req.user.section
      };
    } else if (req.user.role === 'Teacher') {
      // Teachers see their own courses
      query = { teacher: req.user.id };
    }
    // Admins see everything (no query changes)

    const courses = await Course.find(query).populate('teacher', 'name');
    res.send(courses);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const uploadMaterial = async (req, res) => {
  try {
    const { title, type, courseId } = req.body;
    const material = new Material({
      title,
      type,
      course: courseId,
      fileUrl: `/uploads/${req.file.filename}`
    });
    await material.save();
    res.status(201).send(material);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCourseMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId });
    res.send(materials);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (!course) return res.status(404).send({ error: 'Course not found' });
    res.send(course);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { createCourse, getCourses, uploadMaterial, getCourseMaterials, getCourseById };
