const MenuItem = require('../models/MenuItem');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getMenuItems = async (req, res) => {
  try {
    const { includeUnavailable } = req.query;
    const filter = includeUnavailable === 'true' ? {} : { isAvailable: true };
    const items = await MenuItem.find(filter).populate('category', 'name slug');
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name slug');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.categoryId, isAvailable: true });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPopularItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isPopular: true, isAvailable: true }).limit(8);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer, 'menu-items');
    }

    const { name, category, price, description, isPopular, customization, nutritionalInfo } = req.body;
    
<<<<<<< HEAD
=======
    // Parse JSON strings from form-data if needed
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
    const parsedCustomization = typeof customization === 'string' ? JSON.parse(customization) : customization;
    const parsedNutritionalInfo = typeof nutritionalInfo === 'string' ? JSON.parse(nutritionalInfo) : nutritionalInfo;

    const menuItem = await MenuItem.create({
      name,
      category,
      price,
      description,
      image: imageData,
      isPopular: isPopular === 'true' || isPopular === true,
      customization: parsedCustomization,
      nutritionalInfo: parsedNutritionalInfo
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, isPopular, customization, nutritionalInfo, isAvailable } = req.body;
    let updateData = { name, category, price, description, isPopular: isPopular === 'true', isAvailable: isAvailable === 'true' };
    
    if (req.file) {
      const imageData = await uploadToCloudinary(req.file.buffer, 'menu-items');
      updateData.image = imageData;
    }

    if (customization) {
      updateData.customization = typeof customization === 'string' ? JSON.parse(customization) : customization;
    }
    if (nutritionalInfo) {
      updateData.nutritionalInfo = typeof nutritionalInfo === 'string' ? JSON.parse(nutritionalInfo) : nutritionalInfo;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, { $set: updateData }, {
      new: true,
      runValidators: true
    });

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    item.isAvailable = !item.isAvailable;
    await item.save();
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
