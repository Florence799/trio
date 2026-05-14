const fs = require('fs').promises;
const path = require('path');
const Course = require('../models/Course');
const Material = require('../models/Material');
const User = require('../models/User');

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
        section: req.user.section
      };
      if (req.user.year) {
        query.year = req.user.year;
      }
    } else if (req.user.role === 'Teacher' || req.user.role === 'Faculty') {
      // Faculty see their own courses
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
    if (!req.file) {
      return res.status(400).send({ error: 'No file received. Choose a file and try again.' });
    }
    const { title, type, courseId } = req.body;
    if (!title || !type || !courseId) {
      return res.status(400).send({ error: 'Title, type, and course are required.' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: 'Course not found.' });
    }
    const isOwner = course.teacher.toString() === req.user.id.toString();
    if (req.user.role !== 'Admin' && !isOwner) {
      return res.status(403).send({ error: 'You can only upload materials to your own courses.' });
    }
    const material = new Material({
      title,
      type,
      course: courseId,
      fileUrl: `/uploads/${req.file.filename}`,
    });
    await material.save();
    res.status(201).send(material);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCourseMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId }).sort({ createdAt: -1 });
    res.send(materials);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.materialId);
    if (!material) return res.status(404).send({ error: 'Material not found' });

    const course = await Course.findById(material.course);
    if (!course) return res.status(404).send({ error: 'Course not found' });

    const isOwner = course.teacher.toString() === req.user.id.toString();
    if (req.user.role !== 'Admin' && !isOwner) {
      return res.status(403).send({ error: 'Access denied.' });
    }

    if (material.fileUrl) {
      const relative = material.fileUrl.replace(/^\//, '');
      const filePath = path.join(process.cwd(), relative);
      try {
        await fs.unlink(filePath);
      } catch {
        // File missing on disk — still remove DB record
      }
    }

    await Material.findByIdAndDelete(req.params.materialId);
    res.send({ message: 'Material deleted successfully.' });
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

const getRegisteredStudentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });

    const students = await User.find({
      role: 'Student',
      department: course.department,
      section: course.section,
    }).select('name email registeredNumber department year section mobile createdAt');

    res.send({ course, students });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  uploadMaterial,
  getCourseMaterials,
  deleteMaterial,
  getCourseById,
  getRegisteredStudentsByCourse,
};
