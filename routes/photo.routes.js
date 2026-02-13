export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (photo.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await photo.deleteOne();

    res.json({ message: "Photo deleted" });
  } catch (error) {
    next(error);
  }
};
