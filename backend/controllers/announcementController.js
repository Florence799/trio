const Announcement = require('../models/Announcement');

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetRole, category } = req.body;
    const announcement = new Announcement({
      title,
      content,
      targetRole,
      category,
      createdBy: req.user.id
    });
    await announcement.save();
    res.status(201).send(announcement);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { role } = req.user;
    const query = (role === 'Admin') 
      ? {} 
      : { targetRole: { $in: [role, 'All'] } };
    
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.send(announcements);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.send({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };
