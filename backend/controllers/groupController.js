const User = require("../models/User");
const Group = require("../models/Group");


// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {

    const {
      name,
      subject,
      level,
      availability,
      maxMembers
    } = req.body;

    const group = await Group.create({
      name,
      subject,
      level,
      availability,
      maxMembers,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    res.status(201).json(group);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// JOIN GROUP
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // avoid duplicate join
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    group.members.push(req.user.id);
    await group.save();

    res.json({ message: "Joined group successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyGroups = async (req, res) => {

  try {

    const groups = await Group.find({
      members: req.user.id
    });

    res.json(groups);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};
// GET ALL GROUPS
exports.getGroups = async (req, res) => {
  try {

  const groups = await Group.find();

  const updatedGroups = groups.map(group => ({
  ...group.toObject(),

  isAdmin:
    group.createdBy?.toString() ===
    req.user.id,

  isMember:
    group.members.some(
      member =>
        member.toString() === req.user.id
    )
}));

    res.json(updatedGroups);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteGroup = async (req, res) => {

  try {

    const group = await Group.findById(
      req.params.id
    );

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    if (
      group.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only group admin can delete"
      });
    }

    await Group.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Group deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};
exports.getRecommendedGroups = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const groups = await Group.find();

    const recommended = groups.filter(group => {

      // SUBJECT MATCH
      
      const subjectMatch =
  user.subjects.some(
    subject =>
      subject.toLowerCase() ===
      group.subject.toLowerCase()
  );
      // AVAILABILITY MATCH
     const availabilityMatch =
  group.availability?.some(slot =>
    user.availability.some(
      a =>
        a.toLowerCase() ===
        slot.toLowerCase()
    )
  );

      // SKILL MATCH
      let levelMatch = false;

      if (user.skillLevel === "beginner") {
        levelMatch =
          group.level === "beginner" ||
          group.level === "intermediate";
      }

      else if (user.skillLevel === "intermediate") {
        levelMatch =
          group.level === "intermediate" ||
          group.level === "advanced";
      }

      else {
        levelMatch =
          group.level === "advanced";
      }

      return (
        subjectMatch &&
        availabilityMatch &&
        levelMatch
      );

    });

    res.json(recommended);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
